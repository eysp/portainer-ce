import { Download } from 'lucide-react';
import { useState } from 'react';

import { Widget, WidgetBody, WidgetTitle } from '@@/Widget';
import { FormSection } from '@@/form-components/FormSection';
import { BoxSelector } from '@@/BoxSelector';

import { BackupFormType, options } from './backup-options';
import { BackupFileForm } from './BackupFileForm';
import { BackupS3Form } from './BackupS3Form';

export function BackupSettingsPanel() {
  const [backupType, setBackupType] = useState(options[0].value);

  return (
    <Widget>
      <WidgetTitle icon={Download} title="备份 Portainer" />
      <WidgetBody>
        <div className="form-horizontal">
          <FormSection title="备份配置">
            <div className="form-group col-sm-12 text-muted small">
              这将备份您的 Portainer 服务器配置，不包括容器。
            </div>
            <BoxSelector
              slim
              options={options}
              value={backupType}
              onChange={(v) => setBackupType(v)}
              radioName="backup-type"
            />
  
            {backupType === BackupFormType.S3 ? (
              <BackupS3Form />
            ) : (
              <BackupFileForm />
            )}
          </FormSection>
        </div>
      </WidgetBody>
    </Widget>
  );
}
