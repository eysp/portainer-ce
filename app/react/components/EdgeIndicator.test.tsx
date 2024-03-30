import { createMockEnvironment } from '@/react-tools/test-mocks';
import { renderWithQueryClient } from '@/react-tools/test-utils';

import { EdgeIndicator } from './EdgeIndicator';

test('当未设置边缘 id 时，应显示不关联的标签', async () => {
  const { queryByLabelText } = await renderComponent();

  const unassociatedLabel = queryByLabelText('unassociated');

  expect(unassociatedLabel).toBeVisible();
});

test('给定的边缘 ID 和上次签入已设置，应显示 heartbeat', async () => {
  const { queryByLabelText } = await renderComponent('id', 1);

  expect(queryByLabelText('edge-heartbeat')).toBeVisible();
  expect(queryByLabelText('edge-last-checkin')).toBeVisible();
});

async function renderComponent(
  edgeId = '',
  lastCheckInDate = 0,
  checkInInterval = 0,
  queryDate = 0
) {
  const environment = createMockEnvironment();

  environment.EdgeID = edgeId;
  environment.LastCheckInDate = lastCheckInDate;
  environment.EdgeCheckinInterval = checkInInterval;
  environment.QueryDate = queryDate;

  const queries = renderWithQueryClient(
    <EdgeIndicator environment={environment} showLastCheckInDate />
  );

  await expect(queries.findByRole('status')).resolves.toBeVisible();

  return queries;
}
