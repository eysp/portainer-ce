import { useState } from 'react';
import { Database, Hash, Server, Tag, Wrench } from 'lucide-react';

import { useSystemStatus } from '@/react/portainer/system/useSystemStatus';
import { useSystemVersion } from '@/react/portainer/system/useSystemVersion';

import { Modal } from '@@/modals';
import { Button } from '@@/buttons';

import styles from './Footer.module.css';

export function BuildInfoModalButton() {
  const [isBuildInfoVisible, setIsBuildInfoVisible] = useState(false);
  const statusQuery = useSystemStatus();

  if (!statusQuery.data) {
    return null;
  }

  const { Version } = statusQuery.data;

  return (
    <>
      <button
        type="button"
        data-cy="portainerSidebar-versionNumber"
        className="btn-none"
        onClick={() => setIsBuildInfoVisible(true)}
      >
        {Version}
      </button>
      {isBuildInfoVisible && (
        <BuildInfoModal closeModal={() => setIsBuildInfoVisible(false)} />
      )}
    </>
  );
}

function BuildInfoModal({ closeModal }: { closeModal: () => void }) {
  const versionQuery = useSystemVersion();
  const statusQuery = useSystemStatus();

  if (!statusQuery.data || !versionQuery.data) {
    return null;
  }

  const { Edition } = statusQuery.data;
  const { ServerVersion, DatabaseVersion, Build } = versionQuery.data;

  return (
    <Modal onDismiss={closeModal} aria-label="build-info-modal">
      <Modal.Header title={`Portainer ${Edition}`} />
      <Modal.Body>
        <div className={styles.versionInfo}>
          <table>
            <tbody>
              <tr>
                <td>
                  <span className="inline-flex items-center">
                    <Server size="13" className="space-right" />
                    服务器版本： {ServerVersion}
                  </span>
                </td>
                <td>
                  <span className="inline-flex items-center">
                    <Database size="13" className="space-right" />
                    数据库版本： {DatabaseVersion}
                  </span>
                </td>
              </tr>
              <tr>
                <td>
                  <span className="inline-flex items-center">
                    <Hash size="13" className="space-right" />
                    CI构建编号： {Build.BuildNumber}
                  </span>
                </td>
                <td>
                  <span>
                    <Tag size="13" className="space-right" />
                    镜像标签： {Build.ImageTag}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className={styles.toolsList}>
          <span className="inline-flex items-center">
            <Wrench size="13" className="space-right" />
            编译工具：
          </span>

          <div className={styles.tools}>
            <span className="text-muted small">
              Nodejs v{Build.NodejsVersion}
            </span>
            <span className="text-muted small">Yarn v{Build.YarnVersion}</span>
            <span className="text-muted small">
              Webpack v{Build.WebpackVersion}
            </span>
            <span className="text-muted small">Go v{Build.GoVersion}</span>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button className="w-full" onClick={closeModal}>
          Ok
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
