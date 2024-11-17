import DateTimePicker from 'react-datetime-picker';
import { Calendar, X } from 'lucide-react';
import { useMemo } from 'react';
import { string } from 'yup';
import { useField } from 'formik';

import {
  isoDate,
  parseIsoDate,
  TIME_FORMAT,
} from '@/portainer/filters/filters';

import { FormControl } from '@@/form-components/FormControl';
import { Input } from '@@/form-components/Input';
import { TextTip } from '@@/Tip/TextTip';

import { FormValues } from './types';

interface Props {
  disabled?: boolean;
}

export const FORMAT = 'YYYY-MM-DD HH:mm';

export function ScheduledTimeField({ disabled }: Props) {
  const [{ name, value }, { error }, { setValue }] =
    useField<FormValues['scheduledTime']>('scheduledTime');

  const dateValue = useMemo(() => parseIsoDate(value, FORMAT), [value]);

  if (!value) {
    return null;
  }

  return (
    <>
      <FormControl label="计划日期和时间" errors={error}>
        {!disabled ? (
          <DateTimePicker
            format="y-MM-dd HH:mm"
            className="form-control [&>div]:border-0"
            onChange={(date) => {
              const dateToSave =
                date || new Date(Date.now() + 24 * 60 * 60 * 1000);
              setValue(isoDate(dateToSave.valueOf(), FORMAT));
            }}
            name={name}
            value={dateValue}
            calendarIcon={<Calendar className="lucide" />}
            clearIcon={<X className="lucide" />}
            disableClock
            minDate={new Date(Date.now() - 24 * 60 * 60 * 1000)}
          />
        ) : (
          <Input defaultValue={value} disabled />
        )}
      </FormControl>
      {!disabled && value && (
        <TextTip color="blue">
          如果边缘代理上未设置时区，则将使用 UTC+0。
        </TextTip>
      )}
    </>
  );
}

export function timeValidation() {
  return string()
    .required('计划时间是必填的')
    .test(
      'validFormat',
      `计划时间必须符合格式 ${TIME_FORMAT}`,
      (value) => isValidDate(parseIsoDate(value))
    )
    .test(
      'validDate',
      `计划时间必须大于 ${
        (isoDate(Date.now() - 24 * 60 * 60 * 1000), FORMAT)
      }`,
      (value) =>
        parseIsoDate(value).valueOf() > Date.now() - 24 * 60 * 60 * 1000
    );
}

export function defaultValue() {
  return isoDate(Date.now(), FORMAT);
}

function isValidDate(date: Date) {
  return date instanceof Date && !Number.isNaN(date.valueOf());
}
