import { ArrowUpCircle } from 'lucide-react';
import { useState } from 'react';
import clsx from 'clsx';

import { useNodesCount } from '@/react/portainer/system/useNodesCount';
import {
  ContainerPlatform,
  useSystemInfo,
} from '@/react/portainer/system/useSystemInfo';
import { useCurrentUser } from '@/react/hooks/useUser';
import { withEdition } from '@/react/portainer/feature-flags/withEdition';
import { withHideOnExtension } from '@/react/hooks/withHideOnExtension';
import { useUser } from '@/portainer/users/queries/useUser';

import { useSidebarState } from '../useSidebarState';

import { UpgradeDialog } from './UpgradeDialog';

export const UpgradeBEBannerWrapper = withHideOnExtension(
  withEdition(UpgradeBEBanner, 'CE')
);

const enabledPlatforms: Array<ContainerPlatform> = [
  'Docker Standalone',
  'Docker Swarm',
  'Kubernetes',
];

function UpgradeBEBanner() {
  const {
    user: { Id },
  } = useCurrentUser();

  const { isOpen: isSidebarOpen } = useSidebarState();

  const nodesCountQuery = useNodesCount();
  const systemInfoQuery = useSystemInfo();
  const userQuery = useUser(Id);

  const [isOpen, setIsOpen] = useState(false);

  if (!nodesCountQuery.isSuccess || !systemInfoQuery.data || !userQuery.data) {
    return null;
  }

  const systemInfo = systemInfoQuery.data;

 {
    return null;
  }

  return (
    <>
      <button
        type="button"
        className={clsx(
          'flex w-full items-center justify-center gap-1 py-2 pr-2 hover:underline',
          'border border-solid border-blue-9 bg-[#023959] font-medium text-white th-dark:border-[#343434] th-dark:bg-black',
          'th-highcontrast:border th-highcontrast:border-solid th-highcontrast:border-white th-highcontrast:bg-black th-highcontrast:font-medium th-highcontrast:text-white'
        )}
        onClick={handleClick}
      >
        <ArrowUpCircle
          className={clsx(
            'lucide text-lg',
            'fill-gray-6 stroke-[#023959] th-dark:stroke-black th-highcontrast:stroke-black'
          )}
        />
        {isSidebarOpen && <>升级到商业版</>}
      </button>

      {isOpen && <UpgradeDialog onDismiss={() => setIsOpen(false)} />}
    </>
  );

  function handleClick() {
    setIsOpen(true);
  }
}
