import { useState } from 'react';

import { Registry } from '@/react/portainer/registries/types';

import { Modal, OnSubmit, openModal } from '@@/modals';
import { Button } from '@@/buttons';
import { PortainerSelect } from '@@/form-components/PortainerSelect';

interface Props {
  registries: Registry[];
  onSubmit: OnSubmit<Registry['Id']>;
  defaultValue: Registry['Id'];
}

function RegistrySelectPrompt({ onSubmit, defaultValue, registries }: Props) {
  const title = '您想使用哪个注册表？';
  const [registryId, setRegistryId] = useState(defaultValue);
  const options = registries2Options(registries);

  return (
    <Modal onDismiss={() => onSubmit()} aria-label={title}>
      <Modal.Header title={title} />

      <Modal.Body>
        <PortainerSelect
          onChange={setRegistryId}
          value={registryId}
          options={options}
        />
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={() => onSubmit()} color="default">
          取消
        </Button>
        <Button onClick={() => onSubmit(registryId)} color="primary">
          更新
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export function selectRegistry(
  registries: Registry[],
  defaultValue: Registry['Id']
) {
  return openModal(RegistrySelectPrompt, {
    registries,
    defaultValue,
  });
}

function registries2Options(registries: Registry[]) {
  return registries.map((r) => ({
    label: r.Name,
    value: r.Id,
  }));
}
