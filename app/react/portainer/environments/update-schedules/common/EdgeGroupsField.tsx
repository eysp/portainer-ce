import { FormikErrors, FormikHandlers } from 'formik';

import { useEdgeGroups } from '@/react/edge/edge-groups/queries/useEdgeGroups';

import { FormControl } from '@@/form-components/FormControl';
import { Select } from '@@/form-components/ReactSelect';
import { TextTip } from '@@/Tip/TextTip';

import { FormValues } from './types';

interface Props {
  disabled?: boolean;
  onBlur: FormikHandlers['handleBlur'];
  value: FormValues['groupIds'];
  error?: FormikErrors<FormValues>['groupIds'];
  onChange(value: FormValues['groupIds']): void;
}

export function EdgeGroupsField({
  disabled,
  onBlur,
  value,
  error,
  onChange,
}: Props) {
  const groupsQuery = useEdgeGroups();

  const selectedGroups = groupsQuery.data?.filter((group) =>
    value.includes(group.Id)
  );

  return (
    <div>
      <FormControl
        label="分组"
        required
        inputId="groups-select"
        errors={error}
        tooltip="更新是基于分组进行的，允许您同时选择多个设备，并能够通过为不同的日期安排更新来逐步推广到所有环境。"
      >
        <Select
          name="groupIds"
          onBlur={onBlur}
          value={selectedGroups}
          inputId="groups-select"
          placeholder="选择一个或多个组"
          onChange={(selectedGroups) =>
            onChange(selectedGroups.map((g) => g.Id))
          }
          isMulti
          options={groupsQuery.data || []}
          getOptionLabel={(group) => group.Name}
          getOptionValue={(group) => group.Id.toString()}
          closeMenuOnSelect={false}
          isDisabled={disabled}
        />
      </FormControl>
      <TextTip color="blue">
        选择要更新的 Edge 环境组
      </TextTip>
    </div>
  );
}
