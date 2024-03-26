import userEvent from '@testing-library/user-event';

import { renderWithQueryClient, waitFor } from '@/react-tools/test-utils';

import { CreateTeamForm } from './CreateTeamForm';

test('填写名称应该使提交按钮可点击，清空名称应该使其禁用', async () => {
  const { findByLabelText, findByText } = renderWithQueryClient(
    <CreateTeamForm users={[]} teams={[]} />
  );

  const button = await findByText('创建团队');
  expect(button).toBeVisible();

  const nameField = await findByLabelText('Name*');
  expect(nameField).toBeVisible();
  expect(nameField).toHaveDisplayValue('');

  expect(button).toBeDisabled();

  const newValue = 'name';
  userEvent.type(nameField, newValue);

  await waitFor(() => {
    expect(nameField).toHaveDisplayValue(newValue);
    expect(button).toBeEnabled();
  });
});
