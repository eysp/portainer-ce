import { AddButton } from '@@/buttons';
import { FormControl } from '@@/form-components/FormControl';
import { Select } from '@@/form-components/ReactSelect';

import { useSources } from './queries/useSources';
import { Source } from './types';

export function GitSourceSelector({
  value,
  onChange,
  error,
  readOnly = false,
}: {
  value?: Source['id'];
  onChange?(source?: Source | null): void;
  error?: string;
  readOnly?: boolean;
}) {
  const sourcesQuery = useSources({ type: 'git' });
  const sources = sourcesQuery.data?.data ?? [];
  const selectedSource = sources.find((s) => s.id === value);

  return (
    <div className="form-group">
      <div className="col-sm-12">
        <FormControl label="资源库" inputId="source-selector" errors={error}>
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <Select
                placeholder="选择一个资源库"
                value={selectedSource ?? null}
                options={sources}
                getOptionLabel={(s) => s.name}
                getOptionValue={(s) => String(s.id)}
                onChange={onChange}
                isClearable
                isLoading={sourcesQuery.isLoading}
                noOptionsMessage={() => '没有可用的 Git 资源库'}
                inputId="source-selector"
                data-cy="source-selector"
                isDisabled={readOnly}
              />
            </div>
            <AddButton
              to="portainer.gitops.sources.new"
              data-cy="create-source-button"
            >
              创建新资源库
            </AddButton>
          </div>
        </FormControl>
      </div>
    </div>
  );
}
