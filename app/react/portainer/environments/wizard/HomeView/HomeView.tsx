import { Wand2, Plug2 } from 'lucide-react';

import { EnvironmentType } from '@/react/portainer/environments/types';
import { useAnalytics } from '@/angulartics.matomo/analytics-services';
import DockerIcon from '@/assets/ico/vendor/docker-icon.svg?c';
import Kube from '@/assets/ico/kube.svg?c';

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
            <WidgetTitle title="环境向导" icon={Wand2} />
            <WidgetBody>
              <div className="row">
                <div className="col-sm-12 form-section-title">
                  欢迎来到Portainer
                </div>
                <div className="text-muted small">
                  {localEnvironmentAdded.status === 'success' && (
                    <p>
                      我们已经将您的{' '}
                      {getTypeLabel(localEnvironmentAdded.type)} 本地环境与Portainer连接起来。
                    </p>
                  )}

                  {localEnvironmentAdded.status === 'error' && (
                    <p>
                      我们无法将您的本地环境连接到Portainer。
                      <br />
                      请确保您的环境正确暴露。获取安装帮助请访问
                      <a href="https://documentation.portainer.io/quickstart/">
                        https://documentation.portainer.io/quickstart
                      </a>
                    </p>
                  )}

                  <p>
                    在下面开始使用您的本地Portainer或连接更多容器环境。
                  </p>
                </div>

                <div className="flex flex-wrap gap-4">
                  {localEnvironmentAdded.status === 'success' && (
                    <Link to="portainer.home" className={styles.link}>
                      <Option
                        icon={
                          localEnvironmentAdded.type === EnvironmentType.Docker
                            ? DockerIcon
                            : Kube
                        }
                        title="开始使用"
                        description="继续使用Portainer运行的本地环境"
                        onClick={() => trackLocalEnvironmentAnalytics()}
                      />
                    </Link>
                  )}
                  <Link to="portainer.wizard.endpoints" className={styles.link}>
                    <Option
                      title="添加环境"
                      icon={Plug2}
                      description="连接其他环境"
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
