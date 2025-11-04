import { EnvironmentId } from '../../types';

import { GroupAssociationTable } from './GroupAssociationTable';

export function AssociatedEnvironmentsSelector({
  onChange,
  value,
}: {
  onChange: (
    value: EnvironmentId[],
    meta: { type: 'add' | 'remove'; value: EnvironmentId }
  ) => void;
  value: EnvironmentId[];
}) {
  return (
    <>
      <div className="col-sm-12 small text-muted">
        您可以通过将环境移动到关联环境表来选择哪些环境应属于此分组。只需点击任何环境条目即可将其从一个表格移动到另一个表格。
      </div>

      <div className="col-sm-12 mt-4">
        <div className="flex">
          <div className="w-1/2">
            <GroupAssociationTable
              title="可用环境"
              query={{
                groupIds: [1],
                excludeIds: value,
              }}
              onClickRow={(env) => {
                if (!value.includes(env.Id)) {
                  onChange([...value, env.Id], { type: 'add', value: env.Id });
                }
              }}
              data-cy="edgeGroupCreate-availableEndpoints"
            />
          </div>
          <div className="w-1/2">
            <GroupAssociationTable
              title="关联环境"
              query={{
                endpointIds: value,
              }}
              onClickRow={(env) => {
                if (value.includes(env.Id)) {
                  onChange(
                    value.filter((id) => id !== env.Id),
                    { type: 'remove', value: env.Id }
                  );
                }
              }}
              data-cy="edgeGroupCreate-associatedEndpoints"
            />
          </div>
        </div>
      </div>
    </>
  );
}
