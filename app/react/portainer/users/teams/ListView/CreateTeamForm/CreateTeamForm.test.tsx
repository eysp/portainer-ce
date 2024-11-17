import userEvent from '@testing-library/user-event';
import { render, waitFor } from '@testing-library/react';

import { withTestQueryProvider } from '@/react/test-utils/withTestQuery';

import { CreateTeamForm } from './CreateTeamForm';

test('填写名称后应使提交按钮可点击，清空名称后应禁用按钮', async () => {
  const Wrapped = withTestQueryProvider(CreateTeamForm);

  const { findByLabelText, findByText } = render(
    <Wrapped users={[]} teams={[]} />
  );

  const button = await findByText('创建团队');
  expect(button).toBeVisible();

  const nameField = await findByLabelText('名称*');
  expect(nameField).toBeVisible();
  expect(nameField).toHaveDisplayValue('');

  expect(button).toBeDisabled();

  const newValue = 'name';
  await userEvent.type(nameField, newValue);

  await waitFor(() => {
    expect(nameField).toHaveDisplayValue(newValue);
    expect(button).toBeEnabled();
  });
});
