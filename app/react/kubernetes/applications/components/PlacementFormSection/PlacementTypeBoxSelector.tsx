import { Sliders, AlignJustify } from 'lucide-react';

import { BoxSelector, BoxSelectorOption } from '@@/BoxSelector';

import { PlacementType } from './types';

type Props = {
  placementType: PlacementType;
  onChange: (placementType: PlacementType) => void;
};

export const placementOptions: ReadonlyArray<BoxSelectorOption<PlacementType>> =
  [
    {
      id: 'placement_hard',
      value: 'mandatory',
      icon: Sliders,
      iconType: 'badge',
      label: '强制',
      description: (
        <>
          仅在符合<b>所有</b>规则的节点上调度此应用程序
        </>
      ),
    },
    {
      id: 'placement_soft',
      value: 'preferred',
      icon: AlignJustify,
      iconType: 'badge',
      label: '首选',
      description:
        '如果可能，在符合规则的节点上调度此应用程序',
    },
  ] as const;

export function PlacementTypeBoxSelector({ placementType, onChange }: Props) {
  return (
    <BoxSelector<PlacementType>
      value={placementType}
      options={placementOptions}
      onChange={(placementType) => onChange(placementType)}
      radioName="placementType"
      slim
    />
  );
}
