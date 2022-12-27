import { EnvironmentType } from '@/portainer/environments/types';
import { useAnalytics } from '@/angulartics.matomo/analytics-services';

import { PageHeader } from '@@/PageHeader';
import { Widget, WidgetBody, WidgetTitle } from '@@/Widget';
import { Link } from '@@/Link';

import { Option } from '../components/Option';

import { useConnectLocalEnvironment } from './useFetchOrCreateLocalEnvironment';
import styles from './HomeView.module.css';

export function HomeView() {
  const localEnvironmentAdded = useConnectLocalEnvironment();
  const { trackEvent } = useAnalytics();
  return (
    <>
      <PageHeader
        title="快速设置"
        breadcrumbs={[{ label: '环境向导' }]}
      />

      <div className="row">
        <div className="col-sm-12">
          <Widget>
            <WidgetTitle title="环境向导" icon="svg-magic" />
            <WidgetBody>
              <div className="row">
                <div className="col-sm-12 form-section-title">
                欢迎使用Portainer
                </div>
                <div className="text-muted small">
                  {localEnvironmentAdded.status === 'success' && (
                    <p>
                      我们已经将你的本地环境{' '}
                      {getTypeLabel(localEnvironmentAdded.type)} 连接到 Portainer.
                    </p>
                  )}

                  {localEnvironmentAdded.status === 'error' && (
                    <p>
                      我们无法将您的本地环境连接到Portainer。
                      <br />
                      请确保你的环境被正确曝光。关于
                      帮助安装，请访问
                      <a href="https://documentation.portainer.io/quickstart/">
                        https://documentation.portainer.io/quickstart
                      </a>
                    </p>
                  )}

                  <p>
                  在下面开始使用你的本地容器或连接更多的
                    容器环境。
                  </p>
                </div>

                <div className="flex flex-wrap gap-4">
                  {localEnvironmentAdded.status === 'success' && (
                    <Link to="portainer.home" className={styles.link}>
                      <Option
                        icon={
                          localEnvironmentAdded.type === EnvironmentType.Docker
                            ? 'fab fa-docker'
                            : 'fas fa-dharmachakra'
                        }
                        title="开始使用"
                        description="使用Portainer正在运行的本地环境进行操作"
                        onClick={() => trackLocalEnvironmentAnalytics()}
                      />
                    </Link>
                  )}
                  <Link to="portainer.wizard.endpoints" className={styles.link}>
                    <Option
                      title="添加环境"
                      icon="fa fa-plug"
                      description="连接到其他环境"
                    />
                  </Link>
                </div>
              </div>
            </WidgetBody>
          </Widget>
        </div>
      </div>
    </>
  );

  function trackLocalEnvironmentAnalytics() {
    trackEvent('endpoint-wizard-endpoint-select', {
      category: 'portainer',
      metadata: { environment: 'Get-started-local-environment' },
    });
  }
}

function getTypeLabel(type?: EnvironmentType) {
  switch (type) {
    case EnvironmentType.Docker:
      return 'Docker';
    case EnvironmentType.KubernetesLocal:
      return 'Kubernetes';
    default:
      return '';
  }
}
