import { FormikErrors } from 'formik';
import { array, object, SchemaOf, string } from 'yup';
import { DeviceMapping } from 'docker-types/generated/1.41';

import { FormError } from '@@/form-components/FormError';
import { InputList, ItemProps } from '@@/form-components/InputList';
import { InputLabeled } from '@@/form-components/Input/InputLabeled';

interface Device {
  pathOnHost: string;
  pathInContainer: string;
}

export type Values = Array<Device>;

export function DevicesField({
  values,
  onChange,
  errors,
}: {
  values: Values;
  onChange: (value: Values) => void;
  errors?: FormikErrors<Device>[];
}) {
  return (
    <InputList
      value={values}
      onChange={onChange}
      item={Item}
      addLabel="添加设备"
      label="设备"
      errors={errors}
      itemBuilder={() => ({ pathOnHost: '', pathInContainer: '' })}
    />
  );
}

function Item({ item, onChange, error }: ItemProps<Device>) {
  return (
    <div className="w-full">
      <div className="flex w-full gap-4">
        <InputLabeled
          value={item.pathOnHost}
          onChange={(e) => onChange({ ...item, pathOnHost: e.target.value })}
          label="主机"
          placeholder="例如 /dev/tty0"
          className="w-1/2"
          size="small"
        />
        <InputLabeled
          value={item.pathInContainer}
          onChange={(e) =>
            onChange({ ...item, pathInContainer: e.target.value })
          }
          label="容器"
          placeholder="例如 /dev/tty0"
          className="w-1/2"
          size="small"
        />
      </div>
      {error && <FormError>{Object.values(error)[0]}</FormError>}
    </div>
  );
}

export function devicesValidation(): SchemaOf<Values> {
  return array(
    object({
      pathOnHost: string().required('主机路径是必需的'),
      pathInContainer: string().required('容器路径是必需的d'),
    })
  );
}

export function toDevicesViewModel(devices: Array<DeviceMapping>): Values {
  return devices.filter(hasPath).map((device) => ({
    pathOnHost: device.PathOnHost,
    pathInContainer: device.PathInContainer,
  }));

  function hasPath(
    device: DeviceMapping
  ): device is { PathOnHost: string; PathInContainer: string } {
    return !!device.PathOnHost && !!device.PathInContainer;
  }
}
