import { Field, useField } from 'formik';

import { TextTip } from '@@/Tip/TextTip';
import { FormControl } from '@@/form-components/FormControl';
import { FormSection } from '@@/form-components/FormSection';
import { Input } from '@@/form-components/Input';
import { InsightsBox } from '@@/InsightsBox';

export function HelmSection() {
  const [{ name }, { error }] = useField<string>('helmRepositoryUrl');

  return (
    <FormSection title="Helm 仓库">
      <div className="mb-2">
        <TextTip color="blue">
          您可以在此处指定您自己的 Helm 仓库的 URL。请参阅{' '}
          <a
            href="https://helm.sh/docs/topics/chart_repository/"
            target="_blank"
            rel="noreferrer"
          >
            官方文档
          </a>{' '}
          了解更多详情。
        </TextTip>
      </div>

      <InsightsBox
        header="免责声明"
        content={
          <>
            当前 Portainer 不支持 OCI 格式的 Helm 图表。
            对 OCI 图表的支持将在未来版本中提供。
            如果您希望对 OCI 支持提供反馈或获取早期版本以测试此功能，{' '}
            <a
              href="https://bit.ly/3WVkayl"
              target="_blank"
              rel="noopener noreferrer"
            >
              请联系我们
            </a>
            。
          </>
        }
        className="block w-fit mt-2 mb-1"
      />

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
