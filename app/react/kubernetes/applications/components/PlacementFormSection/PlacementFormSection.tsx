import { FormikErrors } from 'formik';
import { useMemo } from 'react';

import { useNodesQuery } from '@/react/kubernetes/cluster/HomeView/nodes.service';
import { useEnvironmentId } from '@/react/hooks/useEnvironmentId';

import { FormSection } from '@@/form-components/FormSection';
import { TextTip } from '@@/Tip/TextTip';
import { InputList } from '@@/form-components/InputList';

import { PlacementsFormValues, NodeLabels, Placement } from './types';
import { PlacementItem } from './PlacementItem';
import { PlacementTypeBoxSelector } from './PlacementTypeBoxSelector';

type Props = {
  values: PlacementsFormValues;
  onChange: (values: PlacementsFormValues) => void;
  errors?: FormikErrors<PlacementsFormValues>;
};

export function PlacementFormSection({ values, onChange, errors }: Props) {
  // node labels are all of the unique node labels across all nodes
  const nodesLabels = useNodeLabels();
  // available node labels are the node labels that are not already in use by a placement
  const availableNodeLabels = useAvailableNodeLabels(
    nodesLabels,
    values.placements
  );
  const firstAvailableNodeLabel = Object.keys(availableNodeLabels)[0] || '';
  const firstAvailableNodeLabelValue =
    availableNodeLabels[firstAvailableNodeLabel]?.[0] || '';
  const nonDeletedPlacements = values.placements.filter(
    (placement) => !placement.needsDeletion
  );

  return (
    <div className="flex flex-col">
      <FormSection title="放置偏好和约束" titleSize="sm">
        {values.placements?.length > 0 && (
          <TextTip color="blue">
            在符合以下<b>所有</b>放置规则的节点上部署此应用程序。放置规则基于节点标签。
          </TextTip>
        )}
        <InputList<Placement>
          value={values.placements}
          onChange={(placements) => onChange({ ...values, placements })}
          renderItem={(item, onChange, index, error) => (
            <PlacementItem
              item={item}
              onChange={onChange}
              error={error}
              index={index}
              nodesLabels={nodesLabels}
              availableNodeLabels={availableNodeLabels}
            />
          )}
          itemBuilder={() => ({
            label: firstAvailableNodeLabel,
            value: firstAvailableNodeLabelValue,
            needsDeletion: false,
          })}
          errors={errors?.placements}
          addLabel="添加规则"
          canUndoDelete
          data-cy="k8sAppCreate-placement"
          disabled={Object.keys(availableNodeLabels).length === 0}
          addButtonError={
            Object.keys(availableNodeLabels).length === 0
              ? '没有可用的节点标签可添加。'
              : ''
          }
        />
      </FormSection>
      {nonDeletedPlacements.length >= 1 && (
        <FormSection
          title="放置策略"
          titleSize="sm"
          titleClassName="control-label !text-[0.9em]"
        >
          <TextTip color="blue">
            指定与放置规则关联的策略。
          </TextTip>
          <PlacementTypeBoxSelector
            placementType={values.placementType}
            onChange={(placementType) => onChange({ ...values, placementType })}
          />
        </FormSection>
      )}
    </div>
  );
}

function useAvailableNodeLabels(
  nodeLabels: NodeLabels,
  placements: Placement[]
): NodeLabels {
  return useMemo(() => {
    const existingPlacementLabels = placements.map(
      (placement) => placement.label
    );
    const availableNodeLabels = Object.keys(nodeLabels).filter(
      (label) => !existingPlacementLabels.includes(label)
    );
    return availableNodeLabels.reduce((acc, label) => {
      acc[label] = nodeLabels[label];
      return acc;
    }, {} as NodeLabels);
  }, [nodeLabels, placements]);
}

function useNodeLabels(): NodeLabels {
  const environmentId = useEnvironmentId();
  const { data: nodes } = useNodesQuery(environmentId);

  // all node label pairs (some might have the same key but different values)
  const nodeLabelPairs =
    nodes?.flatMap((node) =>
      Object.entries(node.metadata?.labels || {}).map(([k, v]) => ({
        key: k,
        value: v,
      }))
    ) || [];

  // create a NodeLabels object with each label key's possible values, without duplicate keys or values. 例如 { 'beta.kubernetes.io/arch': ['amd64', 'arm64'] }
  // in multinode clusters, there can be multiple nodes with the same label key
  const allNodesLabels = nodeLabelPairs.map((pair) => pair.key);
  const uniqueNodesLabels = new Set(allNodesLabels);
  const nodesLabels: NodeLabels = Array.from(uniqueNodesLabels).reduce(
    (acc: NodeLabels, key) => {
      // get all possible values for a given node label key
      const allNodeValuesForKey = nodeLabelPairs
        .filter((pair) => pair.key === key)
        .map((pair) => pair.value);
      // in multinode clusters, there can be duplicate values for a given key, so remove them
      const uniqueValues = Array.from(new Set(allNodeValuesForKey));

      acc[key] = uniqueValues;
      return acc;
    },
    {} as NodeLabels
  );

  return nodesLabels;
}
