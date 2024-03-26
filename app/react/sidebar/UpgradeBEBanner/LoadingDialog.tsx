import { Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';

import { useSystemStatus } from '@/react/portainer/system/useSystemStatus';

import { Modal } from '@@/modals/Modal';
import { Icon } from '@@/Icon';

export function LoadingDialog() {
  useWaitForServerStatus();

  return (
    <Modal aria-label="升级Portainer至企业版">
      <Modal.Body>
        <div className="flex w-full flex-col items-center justify-center">
          <Icon
            icon={Loader2}
            className="animate-spin-slow !text-8xl !text-blue-8"
            aria-label="加载中"
          />

          <h1 className="!text-2xl">正在升级Portainer...</h1>

          <p className="text-center text-xl text-gray-6">
            请稍等，我们正在将您的Portainer升级至企业版。
          </p>
        </div>
      </Modal.Body>
    </Modal>
  );
}

function useWaitForServerStatus() {
  const [enabled, setEnabled] = useState(false);
  useSystemStatus({
    enabled,
    retry: true,
    onSuccess() {
      window.location.reload();
    },
  });

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setEnabled(true);
    }, 3000);

    return () => {
      clearTimeout(timeoutId);
    };
  });
}
