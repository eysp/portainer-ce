import { LoadingButton } from '@@/buttons/LoadingButton';
import { FormSectionTitle } from '@@/form-components/FormSectionTitle';

export interface Props {
  onSubmit(): void;
  isLoading: boolean;
}

export function SaveAuthSettingsButton({ onSubmit, isLoading }: Props) {
  return (
    <>
      <FormSectionTitle>操作</FormSectionTitle>
      <div className="form-group">
        <div className="col-sm-12">
          <LoadingButton
            loadingText="Saving..."
            isLoading={isLoading}
            onClick={() => onSubmit()}
          >
            保存设置
          </LoadingButton>
        </div>
      </div>
    </>
  );
}
