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
      label="拉取间隔"
      inputId="repository_fetch_interval"
      tooltip="使用如下语法来指定轮询发生的频率，例如，5m = 5分钟，24h = 24小时，6h40m = 6小时40分钟。"
      required
      errors={errors}
    >
      <Input
        mRef={ref}
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
      .required('该字段是必需的。')
      // TODO: find a regex that validates time.Duration
      // .matches(
      //   // validate golang time.Duration format
      //   // https://cs.opensource.google/go/go/+/master:src/time/format.go;l=1590
      //   /[-+]?([0-9]*(\.[0-9]*)?[a-z]+)+/g,
      //   'Please enter a valid time interval.'
      // )
      .test(
        'minimumInterval',
        '最小间隔为1分钟',
        (value) => !!value && parse(value, 'minute') >= 1
      )
  );
}
