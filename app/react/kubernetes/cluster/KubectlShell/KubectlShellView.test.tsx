import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi, type Mock } from 'vitest';
import { Terminal } from 'xterm';
import { fit } from 'xterm/lib/addons/fit/fit';

import { terminalClose } from '@/portainer/services/terminal-window';
import { error as notifyError } from '@/portainer/services/notifications';

import { KubectlShellView } from './KubectlShellView';

// Mock modules first
vi.mock('xterm', () => ({
  Terminal: vi.fn(() => ({
    open: vi.fn(),
    setOption: vi.fn(),
    focus: vi.fn(),
    writeln: vi.fn(),
    writeUtf8: vi.fn(),
    onData: vi.fn(),
    onKey: vi.fn(),
    dispose: vi.fn(),
  })),
}));

vi.mock('xterm/lib/addons/fit/fit', () => ({
  fit: vi.fn(),
}));

vi.mock('@/react/hooks/useEnvironmentId', () => ({
  useEnvironmentId: () => 1,
}));

vi.mock('@/portainer/helpers/pathHelper', () => ({
  baseHref: vi.fn().mockReturnValue('/portainer/'),
}));

vi.mock('@/portainer/services/terminal-window', () => ({
  terminalClose: vi.fn(),
}));

vi.mock('@/portainer/services/notifications', () => ({
  error: vi.fn(),
}));

// Mock WebSocket globally
const originalWebSocket = global.WebSocket;
let mockWebSocket: {
  send: Mock;
  close: Mock;
  addEventListener: Mock;
  removeEventListener: Mock;
  readyState: number;
};
let mockTerminalInstance: Partial<Terminal>;

beforeEach(() => {
  vi.clearAllMocks();

  // Create mock terminal instance
  mockTerminalInstance = {
    open: vi.fn(),
    setOption: vi.fn(),
    focus: vi.fn(),
    writeln: vi.fn(),
    writeUtf8: vi.fn(),
    onData: vi.fn(),
    onKey: vi.fn(),
    dispose: vi.fn(),
  };

  // Mock Terminal constructor to return our mock instance
  vi.mocked(Terminal).mockImplementation(
    () => mockTerminalInstance as Terminal
  );

  // Create mock WebSocket instance
  mockWebSocket = {
    send: vi.fn(),
    close: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    readyState: WebSocket.OPEN,
  };

  global.WebSocket = vi.fn(() => mockWebSocket) as unknown as typeof WebSocket;

  // Reset window methods
  Object.defineProperty(window, 'location', {
    value: {
      protocol: 'https:',
      host: 'localhost:3000',
    },
    writable: true,
  });

  Object.defineProperty(window, 'addEventListener', {
    value: vi.fn(),
    writable: true,
  });

  Object.defineProperty(window, 'removeEventListener', {
    value: vi.fn(),
    writable: true,
  });
});

afterEach(() => {
  global.WebSocket = originalWebSocket;
});

describe('KubectlShellView', () => {
  it('renders loading state initially', () => {
    render(<KubectlShellView />);

    expect(screen.getByText('Loading Terminal...')).toBeInTheDocument();
  });

  it('creates WebSocket connection with correct URL', () => {
    render(<KubectlShellView />);

    expect(global.WebSocket).toHaveBeenCalledWith(
      'wss://localhost:3000/portainer/api/websocket/kubernetes-shell?endpointId=1'
    );
  });

  it('creates WebSocket connection with ws protocol when location is http', () => {
    Object.defineProperty(window, 'location', {
      value: {
        protocol: 'http:',
        host: 'localhost:3000',
      },
      writable: true,
    });

    render(<KubectlShellView />);

    expect(global.WebSocket).toHaveBeenCalledWith(
      'ws://localhost:3000/portainer/api/websocket/kubernetes-shell?endpointId=1'
    );
  });

  it('sets up terminal event handlers on mount', () => {
    render(<KubectlShellView />);

    expect(mockTerminalInstance.onData).toHaveBeenCalled();
    expect(mockTerminalInstance.onKey).toHaveBeenCalled();
  });

  it('adds window resize listener on mount', () => {
    render(<KubectlShellView />);

    expect(window.addEventListener).toHaveBeenCalledWith(
      'resize',
      expect.any(Function)
    );
  });

  it('sends terminal data to WebSocket when terminal data event fires', () => {
    render(<KubectlShellView />);

    const onDataCallback = (mockTerminalInstance.onData as Mock).mock
      .calls[0][0] as (data: string) => void;
    onDataCallback('test data');

    expect(mockWebSocket.send).toHaveBeenCalledWith('test data');
  });

  it('closes WebSocket and disposes terminal when Ctrl+D is pressed', () => {
    render(<KubectlShellView />);

    const onKeyCallback = (mockTerminalInstance.onKey as Mock).mock
      .calls[0][0] as (event: { domEvent: KeyboardEvent }) => void;
    onKeyCallback({
      domEvent: {
        ctrlKey: true,
        code: 'KeyD',
      } as KeyboardEvent,
    });

    expect(mockWebSocket.close).toHaveBeenCalled();
    expect(mockTerminalInstance.dispose).toHaveBeenCalled();
  });

  it('handles user typing in terminal', () => {
    render(<KubectlShellView />);

    const onDataCallback = (mockTerminalInstance.onData as Mock).mock
      .calls[0][0] as (data: string) => void;

    // Simulate user typing a kubectl command
    const userInput = 'kubectl get pods';
    onDataCallback(userInput);

    expect(mockWebSocket.send).toHaveBeenCalledWith(userInput);
  });

  it('handles Enter key in terminal', () => {
    render(<KubectlShellView />);

    const onDataCallback = (mockTerminalInstance.onData as Mock).mock
      .calls[0][0] as (data: string) => void;

    // Simulate user pressing Enter key
    const enterKey = '\r';
    onDataCallback(enterKey);

    expect(mockWebSocket.send).toHaveBeenCalledWith(enterKey);
  });

  it('sets up WebSocket event listeners when socket is created', () => {
    render(<KubectlShellView />);

    expect(mockWebSocket.addEventListener).toHaveBeenCalledWith(
      'open',
      expect.any(Function)
    );
    expect(mockWebSocket.addEventListener).toHaveBeenCalledWith(
      'message',
      expect.any(Function)
    );
    expect(mockWebSocket.addEventListener).toHaveBeenCalledWith(
      'close',
      expect.any(Function)
    );
    expect(mockWebSocket.addEventListener).toHaveBeenCalledWith(
      'error',
      expect.any(Function)
    );
  });

  it('opens terminal when WebSocket connection opens', () => {
    render(<KubectlShellView />);

    const openCallback = mockWebSocket.addEventListener.mock.calls.find(
      (call: unknown[]) => call[0] === 'open'
    )![1] as () => void;

    openCallback();

    expect(mockTerminalInstance.open).toHaveBeenCalled();
    expect(mockTerminalInstance.setOption).toHaveBeenCalledWith(
      'cursorBlink',
      true
    );
    expect(mockTerminalInstance.focus).toHaveBeenCalled();
    expect(vi.mocked(fit)).toHaveBeenCalledWith(mockTerminalInstance);
    expect(mockTerminalInstance.writeln).toHaveBeenCalledWith(
      '#Run kubectl commands inside here'
    );
    expect(mockTerminalInstance.writeln).toHaveBeenCalledWith(
      '#e.g. kubectl get all'
    );
    expect(mockTerminalInstance.writeln).toHaveBeenCalledWith('');
  });

  it('writes WebSocket message data to terminal', () => {
    render(<KubectlShellView />);

    const messageCallback = mockWebSocket.addEventListener.mock.calls.find(
      (call: unknown[]) => call[0] === 'message'
    )![1] as (event: MessageEvent) => void;

    const mockEvent = { data: 'terminal output' } as MessageEvent;
    messageCallback(mockEvent);

    expect(mockTerminalInstance.writeUtf8).toHaveBeenCalled();
  });

  it('shows disconnected state when WebSocket closes', async () => {
    render(<KubectlShellView />);

    const closeCallback = mockWebSocket.addEventListener.mock.calls.find(
      (call: unknown[]) => call[0] === 'close'
    )![1] as () => void;

    closeCallback();

    await waitFor(() => {
      expect(screen.getByText('Console disconnected')).toBeInTheDocument();
    });

    expect(vi.mocked(terminalClose)).toHaveBeenCalled();
    expect(mockWebSocket.close).toHaveBeenCalled();
    expect(mockTerminalInstance.dispose).toHaveBeenCalled();
  });

  it('shows disconnected state when WebSocket errors', async () => {
    render(<KubectlShellView />);

    const errorCallback = mockWebSocket.addEventListener.mock.calls.find(
      (call: unknown[]) => call[0] === 'error'
    )![1] as (event: Event) => void;

    const mockError = new Event('error');
    errorCallback(mockError);

    await waitFor(() => {
      expect(screen.getByText('Console disconnected')).toBeInTheDocument();
    });

    expect(vi.mocked(terminalClose)).toHaveBeenCalled();
    expect(mockWebSocket.close).toHaveBeenCalled();
    expect(mockTerminalInstance.dispose).toHaveBeenCalled();
  });

  it('does not show error notification when WebSocket error occurs and socket is closed', () => {
    render(<KubectlShellView />);

    // Set the WebSocket state to CLOSED
    mockWebSocket.readyState = WebSocket.CLOSED;

    const errorCallback = mockWebSocket.addEventListener.mock.calls.find(
      (call: unknown[]) => call[0] === 'error'
    )![1] as (event: Event) => void;

    const mockError = new Event('error');
    errorCallback(mockError);

    expect(vi.mocked(notifyError)).not.toHaveBeenCalled();
  });

  it('renders reload button in disconnected state', async () => {
    render(<KubectlShellView />);

    const closeCallback = mockWebSocket.addEventListener.mock.calls.find(
      (call: unknown[]) => call[0] === 'close'
    )![1] as () => void;

    closeCallback();

    await waitFor(() => {
      const reloadButton = screen.getByTestId('k8sShell-reloadButton');
      expect(reloadButton).toBeInTheDocument();
      expect(reloadButton).toHaveTextContent('Reload');
    });
  });

  it('renders close button in disconnected state', async () => {
    render(<KubectlShellView />);

    const closeCallback = mockWebSocket.addEventListener.mock.calls.find(
      (call: unknown[]) => call[0] === 'close'
    )![1] as () => void;

    closeCallback();

    await waitFor(() => {
      const closeButton = screen.getByTestId('k8sShell-closeButton');
      expect(closeButton).toBeInTheDocument();
      expect(closeButton).toHaveTextContent('Close');
    });
  });

  it('reloads window when reload button is clicked', async () => {
    const user = userEvent.setup();
    const mockReload = vi.fn();
    Object.defineProperty(window, 'location', {
      value: { reload: mockReload },
      writable: true,
    });

    render(<KubectlShellView />);

    const closeCallback = mockWebSocket.addEventListener.mock.calls.find(
      (call: unknown[]) => call[0] === 'close'
    )![1] as () => void;

    closeCallback();

    // Wait for button to appear in disconnected state
    const reloadButton = await screen.findByTestId('k8sShell-reloadButton');
    expect(reloadButton).toHaveTextContent('Reload');

    // Click the button
    await user.click(reloadButton);
    expect(mockReload).toHaveBeenCalled();
  });

  it('closes window when close button is clicked', async () => {
    const user = userEvent.setup();
    const mockClose = vi.fn();
    Object.defineProperty(window, 'close', {
      value: mockClose,
      writable: true,
    });

    render(<KubectlShellView />);

    const closeCallback = mockWebSocket.addEventListener.mock.calls.find(
      (call: unknown[]) => call[0] === 'close'
    )![1] as () => void;

    closeCallback();

    // Wait for button to appear in disconnected state
    const closeButton = await screen.findByTestId('k8sShell-closeButton');
    expect(closeButton).toHaveTextContent('Close');

    // Click the button
    await user.click(closeButton);
    expect(mockClose).toHaveBeenCalled();
  });

  it('removes event listeners on unmount', () => {
    const { unmount } = render(<KubectlShellView />);

    unmount();

    expect(mockWebSocket.removeEventListener).toHaveBeenCalledWith(
      'open',
      expect.any(Function)
    );
    expect(mockWebSocket.removeEventListener).toHaveBeenCalledWith(
      'message',
      expect.any(Function)
    );
    expect(mockWebSocket.removeEventListener).toHaveBeenCalledWith(
      'close',
      expect.any(Function)
    );
    expect(mockWebSocket.removeEventListener).toHaveBeenCalledWith(
      'error',
      expect.any(Function)
    );
    expect(window.removeEventListener).toHaveBeenCalledWith(
      'resize',
      expect.any(Function)
    );
  });

  it('fits terminal on window resize', () => {
    render(<KubectlShellView />);

    const resizeCallback = (window.addEventListener as Mock).mock.calls.find(
      (call: unknown[]) => call[0] === 'resize'
    )![1] as () => void;

    resizeCallback();

    expect(vi.mocked(fit)).toHaveBeenCalledWith(mockTerminalInstance);
  });

  it('cleans up resources on unmount', () => {
    const { unmount } = render(<KubectlShellView />);

    unmount();

    expect(mockWebSocket.close).toHaveBeenCalled();
    expect(mockTerminalInstance.dispose).toHaveBeenCalled();
    expect(window.removeEventListener).toHaveBeenCalledWith(
      'resize',
      expect.any(Function)
    );
  });
});
