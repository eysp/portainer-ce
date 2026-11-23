import _ from 'lodash';

import { Option, PortainerSelect } from '@@/form-components/PortainerSelect';

import { ListState, TemplateType } from './types';
import { TemplateViewModel } from './view-model';
import { TemplateListSort } from './TemplateListSort';

const orderByFields = ['Title', 'Categories', 'Description'] as const;
const typeFilters: ReadonlyArray<Option<TemplateType>> = [
  { label: '独立容器', value: TemplateType.Container },
  { label: 'Swarm 栈', value: TemplateType.SwarmStack },
  { label: 'Compose 栈', value: TemplateType.ComposeStack },
] as const;

export function Filters({
  templates,
  listState,
  onChange,
  disabledTypes = [],
  fixedCategories = [],
}: {
  templates: TemplateViewModel[];
  listState: ListState & { search: string };
  onChange(): void;
  disabledTypes?: Array<TemplateType>;
  fixedCategories?: Array<string>;
}) {
  const categories = _.sortBy(
    _.uniq(templates?.flatMap((template) => template.Categories))
  )
    .filter((category) => !fixedCategories.includes(category))
    .map((category) => ({ label: category, value: category }));

  const templatesTypes = _.uniq(
    templates?.flatMap((template) => template.Type)
  );

  const typeFiltersEnabled = typeFilters.filter(
    (type) =>
      !disabledTypes.includes(type.value) && templatesTypes.includes(type.value)
  );

  return (
    <div className="flex w-full gap-4">
      {categories.length > 0 && (
        <div className="w-1/4">
          <PortainerSelect
            options={categories}
            onChange={(category) => {
              listState.setCategory(category);
              onChange();
            }}
            placeholder="分类"
            value={listState.category}
            bindToBody
            isClearable
            aria-label="分类筛选"
            data-cy="app-templates-category-filter"
          />
        </div>
      )}
      {typeFiltersEnabled.length > 1 && (
        <div className="w-1/4">
          <PortainerSelect<TemplateType>
            isMulti
            options={typeFiltersEnabled}
            onChange={(types) => {
              listState.setTypes(types);
              onChange();
            }}
            placeholder="类型"
            value={listState.types}
            bindToBody
            isClearable
            aria-label="类型筛选"
            data-cy="app-templates-type-filter"
          />
        </div>
      )}
      <div className="ml-auto w-1/4">
        <TemplateListSort
          onChange={(value) => {
            listState.setSortBy(value?.id, value?.desc ?? false);
            onChange();
          }}
          options={orderByFields}
          placeholder="排序方式"
          value={listState.sortBy}
          aria-label="排序"
        />
      </div>
    </div>
  );
}
