import { Minimize2 } from 'lucide-react';
import { NodeSelectorRequirement, Pod } from 'kubernetes-types/core/v1';
import { useMemo } from 'react';

import { Icon } from '@@/Icon';
import { TextTip } from '@@/Tip/TextTip';

import { Application } from '../../types';
import { applicationIsKind } from '../../utils';

type Props = {
  app?: Application;
};

export function PlacementsTable({ app }: Props) {
  const formPlacements = useAppPlacements(app);
  return (
    <>
      <div className="text-muted mb-4 mt-6 flex items-center">
        <Icon icon={Minimize2} className="!mr-2" />
        放置偏好和约束
      </div>
      {!formPlacements.length && (
        <TextTip color="blue">
          此应用程序在应用程序表单中没有 Pod 偏好或约束规则。查看应用程序 YAML 以了解其他放置规则。
        </TextTip>
      )}
      {formPlacements.length > 0 && (
        <table className="table">
          <thead>
            <tr className="text-muted">
              <td className="w-1/3">键</td>
              <td className="w-2/3">值</td>
            </tr>
          </thead>
          <tbody>
            {formPlacements.map((placement, i) => (
              <tr key={i}>
                <td>{placement.key}</td>
                <td>{placement.values?.join(', ')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}

// useAppPlacements is a custom hook that returns the placements that relate to the Portainer application form.
function useAppPlacements(app?: Application): NodeSelectorRequirement[] {
  const formPlacements = useMemo(() => {
    if (!app) {
      return [];
    }
    // firstly get the pod spec
    const podSpec = applicationIsKind<Pod>('Pod', app)
      ? app.spec
      : app.spec?.template?.spec;

    // secondly filter all placements to get the placements that are related to the Portainer form. They are:
    // - preference (s) in spec.affinity.nodeAffinity.preferredDuringSchedulingIgnoredDuringExecution
    const placements =
      podSpec?.affinity?.nodeAffinity
        ?.preferredDuringSchedulingIgnoredDuringExecution;

    // - matchExpressions in preference
    const placementsWithMatchExpressions = placements?.filter(
      (placement) => placement?.preference?.matchExpressions
    );

    // - only matchExpressions items with the operator: In
    const portainerPlacements =
      placementsWithMatchExpressions?.flatMap(
        (placement) =>
          placement?.preference?.matchExpressions?.filter(
            (expression) => expression?.operator === 'In'
          ) || []
      ) || [];
    return portainerPlacements;
  }, [app]);
  return formPlacements;
}
