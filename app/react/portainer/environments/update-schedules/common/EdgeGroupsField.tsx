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
        tooltip="更新基于分组进行，允许您同时选择多个设备，并能够通过为它们安排不同的日期在所有环境中逐步推出。"
      >
        <Select
          name="groupIds"
          onBlur={onBlur}
          value={selectedGroups}
          inputId="groups-select"
          placeholder="选择一个或多个分组"
          onChange={(selectedGroups) =>
            onChange(selectedGroups.map((g) => g.Id))
          }
          isMulti
          options={groupsQuery.data || []}
          getOptionLabel={(group) => group.Name}
          getOptionValue={(group) => group.Id.toString()}
          closeMenuOnSelect={false}
          isDisabled={disabled}
          data-cy="update-schedules-edge-groups-select"
          id="update-schedules-edge-groups-select"
        />
      </FormControl>
      <TextTip color="blue">
        选择要更新的 Edge 环境分组
      </TextTip>
    </div>
  );
}
