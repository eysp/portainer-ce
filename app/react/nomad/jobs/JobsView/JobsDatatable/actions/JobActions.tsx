import { useMutation } from 'react-query';
import { Trash2 } from 'lucide-react';

import { useEnvironmentId } from '@/react/hooks/useEnvironmentId';
import { Job } from '@/react/nomad/types';

import { confirmDelete } from '@@/modals/confirm';
import { LoadingButton } from '@@/buttons/LoadingButton';

import { deleteJobs } from './delete';

interface Props {
  selectedItems: Job[];
  refreshData: () => Promise<void> | void;
}

export function JobActions({ selectedItems, refreshData }: Props) {
  const environmentId = useEnvironmentId();

  const mutation = useMutation(() => deleteJobs(environmentId, selectedItems));

  return (
    <LoadingButton
      loadingText="删除中..."
      isLoading={mutation.isLoading}
      disabled={selectedItems.length < 1 || mutation.isLoading}
      color="danger"
      onClick={handleDeleteClicked}
      icon={Trash2}
    >
      删除
    </LoadingButton>
  );

  async function handleDeleteClicked() {
    const confirmed = await confirmDelete(
      '确定要删除所选的所有作业吗？'
    );

    if (!confirmed) {
      return;
    }

    mutation.mutate(undefined, {
      onSuccess() {
        return refreshData();
      },
    });
  }
}
