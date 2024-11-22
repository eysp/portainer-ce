import { Field, useField } from 'formik';

import { TextTip } from '@@/Tip/TextTip';
import { FormControl } from '@@/form-components/FormControl';
import { FormSection } from '@@/form-components/FormSection';
import { Input } from '@@/form-components/Input';

export function HelmSection() {
  const [{ name }, { error }] = useField<string>('helmRepositoryUrl');

  return (
    <FormSection title="Helm 仓库">
      <div className="mb-2">
        <TextTip color="blue">
          您可以在此处指定您自己的 Helm 仓库的 URL。有关更多详细信息，请参阅{' '}
          <a
            href="https://helm.sh/docs/topics/chart_repository/"
            target="_blank"
            rel="noreferrer"
          >
            官方文档
          </a>{' '}
          。
        </TextTip>
      </div>

      <FormControl label="URL" errors={error} inputId="helm-repo-url">
        <Field
          as={Input}
          id="helm-repo-url"
          name={name}
          placeholder="https://charts.bitnami.com/bitnami"
        />
      </FormControl>
    </FormSection>
  );
}
