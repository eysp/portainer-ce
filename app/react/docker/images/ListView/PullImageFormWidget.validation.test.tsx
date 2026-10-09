import { render } from '@testing-library/react';

import { FormValues } from './PullImageFormWidget.types';
import { useValidation } from './PullImageFormWidget.validation';

function setup(...args: Parameters<typeof useValidation>) {
  const returnVal: { schema?: ReturnType<typeof useValidation> } = {
    schema: undefined,
  };
  function TestComponent() {
    Object.assign(returnVal, { schema: useValidation(...args) });
    return null;
  }
  render(<TestComponent />);
  return returnVal;
}

test('镜像是必填项', async () => {
  const { schema } = setup(false, false);
  const object: FormValues = {
    config: { image: '', registryId: 0, useRegistry: true },
    node: '',
  };

  await expect(
    schema?.validate(object, { strict: true })
  ).rejects.toThrowErrorMatchingInlineSnapshot(
    `[ValidationError: 镜像是必填项]`
  );
});
