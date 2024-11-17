import { useField } from 'formik';

import { confirm } from '@@/modals/confirm';
import { FormControl } from '@@/form-components/FormControl';
import { Switch } from '@@/form-components/SwitchField/Switch';
import { buildConfirmButton } from '@@/modals/utils';
import { ModalType } from '@@/modals';

export function EnabledWaitingRoomSwitch() {
  const [inputProps, meta, helpers] = useField<boolean>('EnableWaitingRoom');

  return (
    <FormControl
      inputId="edge_waiting_room"
      label="启用边缘环境等待室"
      size="medium"
      errors={meta.error}
    >
      <Switch
        id="edge_waiting_room"
        name="EnableWaitingRoom"
        className="space-right"
        checked={inputProps.value}
        onChange={handleChange}
      />
    </FormControl>
  );

  async function handleChange(enable: boolean) {
    if (enable) {
      helpers.setValue(true);
      return;
    }

    const confirmed = await confirm({
      modalType: ModalType.Warn,
      title: '禁用边缘环境等待室',
      message:
        '禁用等待室功能后，所有请求关联的设备将自动关联，这可能带来安全风险。您确定吗？',
      confirmButton: buildConfirmButton('确认', 'danger'),
    });

    if (!confirmed) {
      return;
    }

    helpers.setValue(false);
  }
}
