import { Download, Upload } from 'lucide-react';
import _ from 'lodash';

import { Authorized } from '@/react/hooks/useUser';
import { notifyWarning } from '@/portainer/services/notifications';

import { Button, ButtonGroup, LoadingButton } from '@@/buttons';
import { Link } from '@@/Link';

import { ImagesListResponse } from '../../queries/useImages';
import { useExportMutation } from '../../queries/useExportImageMutation';
import { confirmImageExport } from '../../common/ConfirmExportModal';

export function ImportExportButtons({
  selectedItems,
}: {
  selectedItems: Array<ImagesListResponse>;
}) {
  const exportMutation = useExportMutation();

  return (
    <ButtonGroup>
      <Authorized authorizations="DockerImageLoad">
        <Button
          size="small"
          color="light"
          as={Link}
          data-cy="image-importImageButton"
          icon={Upload}
          disabled={exportMutation.isLoading}
          props={{
            to: 'docker.images.import',
          }}
          aria-disabled={exportMutation.isLoading}
        >
          导入
        </Button>
      </Authorized>
      <Authorized authorizations="DockerImageGet">
        <LoadingButton
          size="small"
          color="light"
          icon={Download}
          isLoading={exportMutation.isLoading}
          loadingText="正在导出..."
          data-cy="image-exportImageButton"
          onClick={() => handleExport()}
          disabled={selectedItems.length === 0}
        >
          导出
        </LoadingButton>
      </Authorized>
    </ButtonGroup>
  );

  async function handleExport() {
    if (!isValidToDownload(selectedItems)) {
      return;
    }

    const confirmed = await confirmImageExport();

    if (!confirmed) {
      return;
    }

    exportMutation.mutate({
      images: selectedItems,
      nodeName: selectedItems[0].nodeName,
    });
  }
}

function isValidToDownload(selectedItems: Array<ImagesListResponse>) {
  for (let i = 0; i < selectedItems.length; i++) {
    const image = selectedItems[i];

    const untagged = image.tags?.find((item) => item.includes('<none>'));

    if (untagged) {
      notifyWarning('', '无法下载未标记的镜像');
      return false;
    }
  }

  if (_.uniqBy(selectedItems, 'nodeName').length > 1) {
    notifyWarning(
      '',
      '无法同时下载来自不同节点的镜像'
    );
    return false;
  }

  return true;
}
