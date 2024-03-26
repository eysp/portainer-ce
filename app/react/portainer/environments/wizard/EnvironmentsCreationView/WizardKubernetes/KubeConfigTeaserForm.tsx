import { Field, Form, Formik } from 'formik';
import { Plug2 } from 'lucide-react';

import { LoadingButton } from '@@/buttons/LoadingButton';
import { FormControl } from '@@/form-components/FormControl';
import { FormSectionTitle } from '@@/form-components/FormSectionTitle';
import { Input } from '@@/form-components/Input';
import { Button } from '@@/buttons';
import { TextTip } from '@@/Tip/TextTip';

const initialValues = {
  kubeConfig: '',
  name: '',
  meta: {
    groupId: 1,
    tagIds: [],
  },
};

export function KubeConfigTeaserForm() {
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
                    href="https://docs.portainer.io/admin/environments/add/kubernetes/import"
                    target="_blank"
                    rel="noreferrer"
                  >
                    导入现有的位于本地或云平台上的Kubernetes集群的kubeconfig文件
                  </a>{' '}
                  将在Portainer中创建相应的环境，并在集群上安装代理。请确保：
                </span>
              </TextTip>
            </div>
            <div className="col-sm-12 text-muted text-xs">
              <ul className="p-2 pl-4">
                <li>您的集群中启用了负载均衡器</li>
                <li>您的kubeconfig中指定了current-context</li>
                <li>
                  kubeconfig是自包含的-包括任何所需的凭据。
                </li>
              </ul>
              <p>
                注：官方支持的云服务提供商包括Civo、Linode、DigitalOcean
                和Microsoft Azure（其他目前不能保证工作）
              </p>
            </div>
          </div>

          <FormControl label="名称e" required>
            <Field
              name="name"
              as={Input}
              data-cy="endpointCreate-nameInput"
              placeholder="例如： docker-prod01 / kubernetes-cluster01"
              readOnly
            />
          </FormControl>

          <FormControl
            label="Kubeconfig 文件"
            required
            inputId="kubeconfig_file"
          >
            <Button disabled>选择一个文件</Button>
          </FormControl>

          <div className="form-group">
            <div className="col-sm-12">
              <LoadingButton
                className="wizard-connect-button !ml-0"
                loadingText="连接环境中..."
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
