import { Terminal } from 'xterm';
import { fit } from 'xterm/lib/addons/fit/fit';
import { useCallback, useEffect, useRef, useState } from 'react';

import { useEnvironmentId } from '@/react/hooks/useEnvironmentId';
import { baseHref } from '@/portainer/helpers/pathHelper';
import { terminalClose } from '@/portainer/services/terminal-window';
import { EnvironmentId } from '@/react/portainer/environments/types';
import { error as notifyError } from '@/portainer/services/notifications';

import { Alert } from '@@/Alert';
import { Button } from '@@/buttons';

type Socket = WebSocket | null;
type ShellState = 'loading' | 'connected' | 'disconnected';

export function KubectlShellView() {
  const environmentId = useEnvironmentId();
  const [terminal] = useState(new Terminal());

  const [socket, setSocket] = useState<Socket>(null);
  const [shellState, setShellState] = useState<ShellState>('loading');

  const terminalElem = useRef(null);

  const closeTerminal = useCallback(() => {
    terminalClose(); // only css trick
    socket?.close();
    terminal.dispose();
    setShellState('disconnected');
  }, [terminal, socket]);

  const openTerminal = useCallback(() => {
    if (!terminalElem.current) {
      return;
    }
    terminal.open(terminalElem.current);
    terminal.setOption('cursorBlink', true);
    terminal.focus();
    fit(terminal);
    terminal.writeln('#Run kubectl commands inside here');
    terminal.writeln('#e.g. kubectl get all');
    terminal.writeln('');
    setShellState('connected');
  }, [terminal]);

  const resizeTerminal = useCallback(() => {
    fit(terminal);
  }, [terminal]);

  // refresh socket listeners on socket updates
  useEffect(() => {
    if (!socket) {
      return () => {};
    }
    function onOpen() {
      openTerminal();
    }
    function onMessage(e: MessageEvent) {
      const encoded = new TextEncoder().encode(e.data);
      terminal.writeUtf8(encoded);
    }
    function onClose() {
      closeTerminal();
    }
    function onError(e: Event) {
      closeTerminal();
      if (socket?.readyState !== WebSocket.CLOSED) {
        notifyError(
          'Failure',
          e as unknown as Error,
          'Websocket connection error'
        );
      }
    }

    socket.addEventListener('open', onOpen);
    socket.addEventListener('message', onMessage);
    socket.addEventListener('close', onClose);
    socket.addEventListener('error', onError);

    return () => {
      socket.removeEventListener('open', onOpen);
      socket.removeEventListener('message', onMessage);
      socket.removeEventListener('close', onClose);
      socket.removeEventListener('error', onError);
    };
  }, [closeTerminal, openTerminal, socket, terminal]);

  // on component load/destroy
  useEffect(() => {
    const socket = new WebSocket(buildUrl(environmentId));
    setSocket(socket);
    setShellState('loading');

    terminal.onData((data) => socket.send(data));
    terminal.onKey(({ domEvent }) => {
      if (domEvent.ctrlKey && domEvent.code === 'KeyD') {
        close();
        setShellState('disconnected');
      }
    });

    window.addEventListener('resize', resizeTerminal);

    function close() {
      socket.close();
      terminal.dispose();
      window.removeEventListener('resize', resizeTerminal);
    }

    return close;
  }, [environmentId, terminal, resizeTerminal]);

  return (
    <div className="fixed bottom-0 left-0 right-0 top-0 z-[10000] bg-black text-white">
      {shellState === 'loading' && (
        <div className="px-4 pt-2">Loading Terminal...</div>
      )}
      {shellState === 'disconnected' && (
        <div className="p-4">
          <Alert color="info" title="Console disconnected">
            <div className="mt-4 flex items-center gap-2">
              <Button
                onClick={() => window.location.reload()}
                data-cy="k8sShell-reloadButton"
              >
                Reload
              </Button>
              <Button
                onClick={() => window.close()}
                color="default"
                data-cy="k8sShell-closeButton"
              >
                Close
              </Button>
            </div>
          </Alert>
        </div>
      )}
      <div className="h-full" ref={terminalElem} />
    </div>
  );

  function buildUrl(environmentId: EnvironmentId) {
    const params = {
      endpointId: environmentId,
    };

    const wsProtocol =
      window.location.protocol === 'https:' ? 'wss://' : 'ws://';
    const path = `${baseHref()}api/websocket/kubernetes-shell`;
    const base = path.startsWith('http')
      ? path.replace(/^https?:\/\//i, '')
      : window.location.host + path;

    const queryParams = Object.entries(params)
      .map(([k, v]) => `${k}=${v}`)
      .join('&');
    return `${wsProtocol}${base}?${queryParams}`;
  }
}
