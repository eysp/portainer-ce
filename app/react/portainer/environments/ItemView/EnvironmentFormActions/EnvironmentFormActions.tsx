import { Save } from 'lucide-react';

import { LoadingButton } from '@@/buttons/LoadingButton';
import { Button } from '@@/buttons';
import { Link } from '@@/Link';

interface Props {
  isLoading: boolean;
  isValid: boolean;
  isDirty: boolean;
}

export function EnvironmentFormActions({ isLoading, isValid, isDirty }: Props) {
  return (
    <div className="form-group">
      <div className="col-sm-12">
        <LoadingButton
          className="wizard-connect-button !ml-0"
          loadingText="正在更新环境..."
          isLoading={isLoading}
          disabled={!isDirty || !isValid}
          icon={Save}
          data-cy="environment-update-button"
        >
          更新环境
        </LoadingButton>

        <Button
          type="button"
          color="default"
          as={Link}
          props={{ to: 'portainer.endpoints' }}
          disabled={isLoading}
          data-cy="environment-cancel-button"
          className="!ml-2"
        >
          取消
        </Button>
      </div>
    </div>
  );
}
