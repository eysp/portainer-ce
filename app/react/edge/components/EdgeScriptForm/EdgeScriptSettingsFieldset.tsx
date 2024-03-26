import { useFormikContext, Field } from 'formik';

import { GroupField } from '@/react/portainer/environments/wizard/EnvironmentsCreationView/shared/MetadataFieldset/GroupsField';

import { FormControl } from '@@/form-components/FormControl';
import { Input } from '@@/form-components/Input';
import { SwitchField } from '@@/form-components/SwitchField';
import { TextTip } from '@@/Tip/TextTip';
import { TagSelector } from '@@/TagSelector';

import { EdgeGroupsSelector } from '../../edge-stacks/components/EdgeGroupsSelector';

import { NomadTokenField } from './NomadTokenField';
import { ScriptFormValues } from './types';

interface Props {
  isNomadTokenVisible?: boolean;
  hideIdGetter?: boolean;
  showMetaFields?: boolean;
}

export function EdgeScriptSettingsFieldset({
  isNomadTokenVisible,
  hideIdGetter,
  showMetaFields,
}: Props) {
  const { values, setFieldValue } = useFormikContext<ScriptFormValues>();

  return (
    <>
      {showMetaFields && (
        <>
          <GroupField name="group" />

          <EdgeGroupsSelector
            value={values.edgeGroupsIds}
            onChange={(value) => setFieldValue('edgeGroupsIds', value)}
            isGroupVisible={(group) => !group.Dynamic}
            horizontal
          />

          <TagSelector
            value={values.tagsIds}
            onChange={(value) => setFieldValue('tagsIds', value)}
          />
        </>
      )}

      {!hideIdGetter && (
        <>
          <FormControl
            label="边缘 ID 生成器"
            tooltip="一个 bash 脚本一行，用于生成边缘 ID，并将其分配给 PORTAINER_EDGE_ID 环境变量"
            inputId="edge-id-generator-input"
          >
            <Input
              type="text"
              name="edgeIdGenerator"
              value={values.edgeIdGenerator}
              id="edge-id-generator-input"
              onChange={(e) => setFieldValue(e.target.name, e.target.value)}
            />
          </FormControl>
          <div className="form-group">
            <div className="col-sm-12">
              <TextTip color="blue">
                <code>PORTAINER_EDGE_ID</code> 环境变量是成功连接边缘代理到 Portainer 所必需的
              </TextTip>
            </div>
          </div>
        </>
      )}

      {isNomadTokenVisible && (
        <>
          <NomadTokenField />

          <div className="form-group">
            <div className="col-sm-12">
              <SwitchField
                label="TLS"
                labelClass="col-sm-3 col-lg-2"
                checked={values.tlsEnabled}
                onChange={(checked) => setFieldValue('tlsEnabled', checked)}
              />
            </div>
          </div>
        </>
      )}

      <FormControl
        label="环境变量"
        tooltip="以逗号分隔的环境变量列表，这些变量将从部署代理的主机上获取。"
        inputId="env-variables-input"
      >
        <Field
          name="envVars"
          as={Input}
          placeholder="foo=bar,myvar"
          id="env-variables-input"
        />
      </FormControl>

      <div className="form-group">
        <div className="col-sm-12">
          <SwitchField
            checked={values.allowSelfSignedCertificates}
            onChange={(value) =>
              setFieldValue('allowSelfSignedCertificates', value)
            }
            label="允许自签名证书"
            labelClass="col-sm-3 col-lg-2"
            tooltip="当允许自签名证书时，边缘代理将在通过 HTTPS 连接到 Portainer 时忽略域验证。"
          />
        </div>
      </div>
    </>
  );
}
