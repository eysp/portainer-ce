import { string } from 'yup';
import parse from 'parse-duration';

import { FormControl } from '@@/form-components/FormControl';
import { Input } from '@@/form-components/Input';
import { useCaretPosition } from '@@/form-components/useCaretPosition';

export function IntervalField({
  onChange,
  value,
  errors,
}: {
  value: string;
  onChange: (value: string) => void;
  errors?: string;
}) {
  const { ref, updateCaret } = useCaretPosition();

  return (
    <FormControl
      label="获取间隔"
      inputId="repository_fetch_interval"
      tooltip="指定轮询发生的频率，使用语法如：5m = 5 分钟，24h = 24 小时，6h40m = 6 小时 40 分钟。"
      required
      errors={errors}
    >
      <Input
        mRef={ref}
        data-cy="repository-fetch-interval-input"
        id="repository_fetch_interval"
        name="repository_fetch_interval"
        placeholder="5m"
        required
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          updateCaret();
        }}
      />
    </FormControl>
  );
}

export function intervalValidation() {
  return (
    string()
      .required('此字段是必需的。')
      // TODO: find a regex that validates time.Duration
      // .matches(
      //   // validate golang time.Duration format
      //   // https://cs.opensource.google/go/go/+/master:src/time/format.go;l=1590
      //   /[-+]?([0-9]*(\.[0-9]*)?[a-z]+)+/g,
      //   '请输入有效的时间间隔。'
      // )
      .test(
        'minimumInterval',
        '最小间隔为 1m',
        (value) => !!value && parse(value, 'minute') >= 1
      )
  );
}
