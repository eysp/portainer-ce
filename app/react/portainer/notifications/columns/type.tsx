import _ from 'lodash';

import { columnHelper } from './helper';

export const type = columnHelper.accessor('type', {
  header: '类型',
  id: 'type',
  cell: ({ getValue }) => {
    const value = getValue();
    const typeMap: Record<string, string> = {
      success: '成功',
      error: '错误',
      warning: '警告',
      info: '信息',
    };
    return typeMap[value.toLowerCase()] || _.capitalize(value);
  },
});
