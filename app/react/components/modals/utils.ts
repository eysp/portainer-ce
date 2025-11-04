import { ComponentProps } from 'react';

import { Button } from '@@/buttons';

import { ButtonOptions } from './types';

export function buildConfirmButton(
  label = '确认',
  color: ComponentProps<typeof Button>['color'] = 'primary',
  timeout = 0,
  dataCy = 'modal-confirm-button'
): ButtonOptions<true> {
  return { label, color, value: true, timeout, dataCy };
}

export function buildCancelButton(
  label = '取消',
  dataCy = 'modal-cancel-button'
): ButtonOptions<false> {
  return {
    label,
    color: 'default',
    value: false,
    dataCy,
  };
}
