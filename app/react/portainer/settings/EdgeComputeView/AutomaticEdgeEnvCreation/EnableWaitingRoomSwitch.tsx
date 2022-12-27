import { useField } from 'formik';

import { confirmAsync } from '@/portainer/services/modal.service/confirm';

import { FormControl } from '@@/form-components/FormControl';
import { Switch } from '@@/form-components/SwitchField/Switch';

export function EnabledWaitingRoomSwitch() {
  const [inputProps, meta, helpers] = useField<boolean>('TrustOnFirstConnect');

  return (
    <FormControl
      inputId="edge_waiting_room"
      label="Disable Edge Environment Waiting Room"
      errors={meta.error}
    >
      <Switch
        id="edge_waiting_room"
        name="TrustOnFirstConnect"
        className="space-right"
        checked={inputProps.value}
        onChange={handleChange}
      />
    </FormControl>
  );

  async function handleChange(trust: boolean) {
    if (!trust) {
      helpers.setValue(false);
      return;
    }

    const confirmed = await confirmAsync({
      title: '禁用边缘环境等候室',
      message:
        '通过禁用等待室功能，所有请求关联的设备都会自动关联，可能会造成安全风险。你确定吗？',
      buttons: {
        cancel: {
          label: '取消',
          className: 'btn-default',
        },
        confirm: {
          label: '确认',
          className: 'btn-danger',
        },
      },
    });

    helpers.setValue(!!confirmed);
  }
}
