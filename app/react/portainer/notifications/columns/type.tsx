import _ from 'lodash';

import { columnHelper } from './helper';

export const type = columnHelper.accessor('type', {
  header: '类别',
  id: 'type',
  cell: ({ getValue }) => {
    const value = getValue();

    return _.capitalize(value);
  },
});
