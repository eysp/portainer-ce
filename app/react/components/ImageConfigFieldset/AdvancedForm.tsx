import { FormikErrors } from 'formik';

import { FormControl } from '@@/form-components/FormControl';
import { Input } from '@@/form-components/Input';
import { TextTip } from '@@/Tip/TextTip';

import { Values } from './types';

export function AdvancedForm({
  values,
  errors,
  onChangeImage,
  setFieldValue,
}: {
  values: Values;
  errors?: FormikErrors<Values>;
  onChangeImage?: (name: string) => void;
  setFieldValue: <T>(field: string, value: T) => void;
}) {
  return (
    <>
      <TextTip color="blue">
        使用高级模式时，镜像和仓库 <b>必须是</b> 公共可用的。
      </TextTip>
      <FormControl label="镜像" inputId="image-field" errors={errors?.image}>
        <Input
          id="image-field"
          value={values.image}
          onChange={(e) => {
            const { value } = e.target;
            setFieldValue('image', value);
            setTimeout(() => onChangeImage?.(value), 0);
          }}
          placeholder="例如 registry:port/my-image:my-tag"
          required
        />
      </FormControl>
    </>
  );
}
