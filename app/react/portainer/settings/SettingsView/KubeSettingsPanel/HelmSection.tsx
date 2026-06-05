import { Field, useField } from 'formik';

import { TextTip } from '@@/Tip/TextTip';
import { FormControl } from '@@/form-components/FormControl';
import { FormSection } from '@@/form-components/FormSection';
import { Input } from '@@/form-components/Input';
import { ExternalLink } from '@@/ExternalLink';

export function HelmSection() {
  const [{ name }, { error }] = useField<string>('helmRepositoryUrl');

  return (
    <FormSection title="Helm 仓库">
      <div className="mb-2">
        <TextTip color="blue">
          您可以在此处指定您自己的{' '}
          <ExternalLink
            to="https://helm.sh/docs/topics/chart_repository/"
            data-cy="helm-repository-link"
          >
            Helm 仓库
          </ExternalLink>{' '}
          的 URL。
        </TextTip>
      </div>

      <FormControl label="URL" errors={error} inputId="helm-repo-url">
        <Field
          as={Input}
          id="helm-repo-url"
          data-cy="helm-repo-url-input"
          name={name}
          placeholder="https://kubernetes.github.io/ingress-nginx"
        />
      </FormControl>
    </FormSection>
  );
}
