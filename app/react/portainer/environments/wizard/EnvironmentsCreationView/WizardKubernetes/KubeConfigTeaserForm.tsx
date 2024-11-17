import { Field, Form, Formik } from 'formik';
import { Plug2 } from 'lucide-react';

import { LoadingButton } from '@@/buttons/LoadingButton';
import { FormControl } from '@@/form-components/FormControl';
import { FormSectionTitle } from '@@/form-components/FormSectionTitle';
import { Input } from '@@/form-components/Input';
import { Button } from '@@/buttons';
import { TextTip } from '@@/Tip/TextTip';
import { useDocsUrl } from '@@/PageHeader/ContextHelp/ContextHelp';

const initialValues = {
  kubeConfig: '',
  name: '',
  meta: {
    groupId: 1,
    tagIds: [],
  },
};

export function KubeConfigTeaserForm() {
  const kubeConfigImportDocUrl = useDocsUrl(
    '/admin/environments/add/kubernetes/import'
  );

  return (
    <Formik initialValues={initialValues} onSubmit={() => {}} validateOnMount>
      {() => (
        <Form>
          <FormSectionTitle>环境详情</FormSectionTitle>
          <div className="form-group">
            <div className="col-sm-12">
              <TextTip color="blue">
                <span className="text-muted">
                  <a
                    href={kubeConfigImportDocUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    导入现有 Kubernetes 集群的 kubeconfig 文件
                  </a>{' '}
                  （位于本地或云平台）。这将创建一个相应的环境
                  在 Portainer 中并在集群上安装代理。请确保：
                </span>
              </TextTip>
            </div>
            <div className="col-sm-12 text-muted text-xs">
              <ul className="p-2 pl-4">
                <li>您的集群中启用了负载均衡器</li>
                <li>在您的 kubeconfig 中指定了 current-context</li>
                <li>
                  kubeconfig 是自包含的 - 包括任何必需的凭证。
                </li>
              </ul>
              <p>
                注意：官方支持的云提供商有 Civo、Akamai Connected Cloud、DigitalOcean 和 Microsoft Azure（目前其他提供商不保证能正常工作）
              </p>
            </div>
          </div>

          <FormControl label="名称" required>
            <Field
              name="name"
              as={Input}
              data-cy="endpointCreate-nameInput"
              placeholder="例如 docker-prod01 / kubernetes-cluster01"
              readOnly
            />
          </FormControl>

          <FormControl
            label="Kubeconfig 文件"
            required
            inputId="kubeconfig_file"
          >
            <Button disabled>选择文件</Button>
          </FormControl>

          <div className="form-group">
            <div className="col-sm-12">
              <LoadingButton
                className="wizard-connect-button !ml-0"
                loadingText="正在连接环境..."
                isLoading={false}
                disabled
                icon={Plug2}
              >
                连接
              </LoadingButton>
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
}
