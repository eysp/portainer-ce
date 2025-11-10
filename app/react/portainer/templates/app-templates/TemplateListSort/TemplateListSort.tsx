import clsx from 'clsx';

import { TableHeaderSortIcons } from '@@/datatables/TableHeaderSortIcons';
import { PortainerSelect } from '@@/form-components/PortainerSelect';

import styles from './TemplateListSort.module.css';

interface Props {
  options: ReadonlyArray<string | { label: string; value: string }>;
  onChange: (value: { id: string; desc: boolean } | undefined) => void;
  placeholder?: string;
  value: { id: string; desc: boolean } | undefined;
}

export function TemplateListSort({
  options,
  onChange,
  placeholder,
  value,
}: Props) {
  const selectOptions = options.map((option) =>
    typeof option === 'string' ? { label: option, value: option } : option
  );

  const getValueForOption = (option: string | { label: string; value: string }) =>
    typeof option === 'string' ? option : option.value;

  return (
    <div className={styles.sortByContainer}>
      <div className={styles.sortByElement}>
        <PortainerSelect
          placeholder={placeholder}
          options={selectOptions}
          onChange={(selectedValue) => {
            const option = options.find(
              (opt) => getValueForOption(opt) === selectedValue
            );
            const id = option ? getValueForOption(option) : undefined;
            onChange(id ? { id, desc: value?.desc ?? false } : undefined);
          }}
          bindToBody
          value={value?.id ?? null}
          isClearable
          data-cy="app-templates-sortby-selector"
        />
      </div>
      <div className={styles.sortByElement}>
        <button
          className={clsx(styles.sortButton, 'h-[34px]')}
          type="button"
          disabled={!value?.id}
          onClick={(e) => {
            e.preventDefault();
            onChange(value ? { id: value.id, desc: !value.desc } : undefined);
          }}
        >
          <TableHeaderSortIcons
            sorted={!!value}
            descending={value?.desc ?? false}
          />
        </button>
      </div>
    </div>
  );
}
