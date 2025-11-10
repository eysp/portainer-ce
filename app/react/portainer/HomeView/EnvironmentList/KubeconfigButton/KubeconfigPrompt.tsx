import clsx from 'clsx';
import { useState } from 'react';

import { downloadKubeconfigFile } from '@/react/portainer/HomeView/EnvironmentList/KubeconfigButton/kubeconfig.service';
import * as notifications from '@/portainer/services/notifications';
import {
  Environment,
  EnvironmentType,
} from '@/react/portainer/environments/types';
import { usePaginationLimitState } from '@/react/hooks/usePaginationLimitState';
import { usePublicSettings } from '@/react/portainer/settings/queries';
import {
  Query,
  useEnvironmentList,
} from '@/react/portainer/environments/queries/useEnvironmentList';
import { useListSelection } from '@/react/hooks/useListSelection';

import { Modal } from '@@/modals';
import { PaginationControls } from '@@/PaginationControls';
import { Checkbox } from '@@/form-components/Checkbox';
import { Button } from '@@/buttons';

import styles from './KubeconfigPrompt.module.css';

export interface KubeconfigPromptProps {
  envQueryParams: Query;
  onClose: () => void;
  selectedItems: Array<Environment['Id']>;
}
const storageKey = 'home_endpoints';

export function KubeconfigPrompt({
  envQueryParams,
  onClose,
  selectedItems,
}: KubeconfigPromptProps) {
  const [page, setPage] = useState(1);
  const [pageLimit, setPageLimit] = usePaginationLimitState(storageKey);

  const expiryQuery = usePublicSettings({
    select: (settings) => expiryMessage(settings.KubeconfigExpiry),
  });

  const [selection, toggleSelection] =
    useListSelection<Environment['Id']>(selectedItems);

  const { environments, totalCount, isLoading } = useEnvironmentList({
    ...envQueryParams,
    page,
    pageLimit,
    types: [
      EnvironmentType.KubernetesLocal,
      EnvironmentType.AgentOnKubernetes,
      EnvironmentType.EdgeAgentOnKubernetes,
    ],
  });
  const isAllPageSelected =
    !isLoading &&
    environments
      .filter((env) => env.Status <= 2)
      .every((env) => selection.includes(env.Id));

  return (
    <Modal aria-label="Kubeconfig 视图" onDismiss={onClose}>
      <Modal.Header title="下载 kubeconfig 文件" />

      <Modal.Body>
        <div>
          <span>
            选择要添加到 kubeconfig 文件的 Kubernetes 环境。
            您可以选择跨多个页面。
          </span>
          <span className="space-left">{expiryQuery.data}</span>
        </div>

        <div className="mt-2 flex h-8 items-center">
          <Checkbox
            id="settings-container-truncate-name"
            data-cy="select-all-checkbox"
            label="全选（本页）"
            checked={isAllPageSelected}
            onChange={handleSelectAll}
          />
        </div>
        <div className="datatable">
          <div className={styles.checkboxList}>
            {environments
              .filter((env) => env.Status <= 2)
              .map((env) => (
                <div
                  key={env.Id}
                  className={clsx(
                    styles.checkbox,
                    'flex h-8 items-center pt-1'
                  )}
                >
                  <Checkbox
                    id={`${env.Id}`}
                    data-cy={`select-environment-checkbox-${env.Name}`}
                    label={`${env.Name} (${env.URL})`}
                    checked={selection.includes(env.Id)}
                    onChange={() =>
                      toggleSelection(env.Id, !selection.includes(env.Id))
                    }
                  />
                </div>
              ))}
          </div>
          <div className="flex w-full justify-end pt-3">
            <PaginationControls
              showAll={totalCount <= 100}
              page={page}
              onPageChange={setPage}
              pageLimit={pageLimit}
              onPageLimitChange={setPageLimit}
              pageCount={Math.ceil(totalCount / pageLimit)}
            />
          </div>
        </div>
      </Modal.Body>

      <Modal.Footer>
        <Button
          onClick={onClose}
          color="default"
          data-cy="cancel-kubeconfig-download-button"
        >
          取消
        </Button>
        <Button
          onClick={handleDownload}
          disabled={selection.length === 0}
          data-cy="download-kubeconfig-confirbutton"
        >
          下载文件
        </Button>
      </Modal.Footer>
    </Modal>
  );

  function handleSelectAll() {
    environments.forEach((env) => toggleSelection(env.Id, !isAllPageSelected));
  }

  function handleDownload() {
    confirmKubeconfigSelection();
  }

  async function confirmKubeconfigSelection() {
    if (selection.length === 0) {
      notifications.warning('未选择环境', '');
      return;
    }
    try {
      await downloadKubeconfigFile(selection);
      onClose();
    } catch (e) {
      notifications.error('下载 kubeconfig 文件失败', e as Error);
    }
  }
}

export function expiryMessage(expiry: string) {
  const prefix = 'kubeconfig 文件将在';
  switch (expiry) {
    case '24h':
      return `${prefix} 1 天后过期。`;
    case '168h':
      return `${prefix} 7 天后过期。`;
    case '720h':
      return `${prefix} 30 天后过期。`;
    case '8640h':
      return `${prefix} 1 年后过期。`;
    case '0':
    default:
      return `kubeconfig 文件不会过期。`;
  }
}
