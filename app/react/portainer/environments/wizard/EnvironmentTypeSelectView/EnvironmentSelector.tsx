import { FormSection } from '@@/form-components/FormSection';

import { Option } from '../components/Option';

import { environmentTypes } from './environment-types';

export type EnvironmentSelectorValue = typeof environmentTypes[number]['id'];

interface Props {
  value: EnvironmentSelectorValue[];
  onChange(value: EnvironmentSelectorValue[]): void;
  createEdgeDevice?: boolean;
}

const hasEdge: EnvironmentSelectorValue[] = [
  'dockerStandalone',
  'dockerSwarm',
  'kubernetes',
];

export function EnvironmentSelector({
  value,
  onChange,
  createEdgeDevice,
}: Props) {
  return (
    <div className="row">
      <FormSection title="选择你的环境">
        <p className="text-muted small">
        你可以登上不同类型的环境，选择所有适用的。
        </p>
        <div className="flex gap-4 flex-wrap">
          {filterEdgeDevicesIfNeed(environmentTypes, createEdgeDevice).map(
            (eType) => (
              <Option
                key={eType.id}
                featureId={eType.featureId}
                title={eType.title}
                description={eType.description}
                icon={eType.icon}
                active={value.includes(eType.id)}
                onClick={() => handleClick(eType.id)}
              />
            )
          )}
        </div>
      </FormSection>
    </div>
  );

  function handleClick(eType: EnvironmentSelectorValue) {
    if (value.includes(eType)) {
      onChange(value.filter((v) => v !== eType));
      return;
    }

    onChange([...value, eType]);
  }
}

function filterEdgeDevicesIfNeed(
  types: typeof environmentTypes,
  createEdgeDevice?: boolean
) {
  if (!createEdgeDevice) {
    return types;
  }

  return types.filter((eType) => hasEdge.includes(eType.id));
}
