import { RefreshCw } from 'lucide-react';

import { FormSection } from '@@/form-components/FormSection';
import { LoadingButton } from '@@/buttons';

interface Props {
  isDirty: boolean;
  isValid: boolean;
  isSaveLoading: boolean;
  isDeployLoading: boolean;
  onDeploy: () => void;
}

export function ActionsSection({
  isDirty,
  isValid,
  isSaveLoading,
  isDeployLoading,
  onDeploy,
}: Props) {
  return (
    <FormSection title="操作">
      <LoadingButton
        size="small"
        color="primary"
        type="button"
        onClick={onDeploy}
        disabled={isDirty || isSaveLoading}
        isLoading={isDeployLoading}
        loadingText="进行中..."
        data-cy="stack-redeploy-button"
      >
        <RefreshCw className="mr-1" />
        拉取并重新部署
      </LoadingButton>

      <LoadingButton
        size="small"
        color="primary"
        disabled={!isDirty || !isValid || isDeployLoading}
        isLoading={isSaveLoading}
        loadingText="进行中..."
        className="ml-2"
        data-cy="stack-save-settings-button"
      >
        保存设置
      </LoadingButton>
    </FormSection>
  );
}
