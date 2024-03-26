import userEvent from '@testing-library/user-event';

import { render } from '@/react-tools/test-utils';

import { CreateAccessToken } from './CreateAccessToken';

test('当描述为空时，按钮禁用；当描述填写时，按钮启用', async () => {
  const queries = renderComponent();

  const button = queries.getByRole('button', { name: '添加访问令牌' });

  expect(button).toBeDisabled();

  const descriptionField = queries.getByLabelText('Description');

  userEvent.type(descriptionField, 'description');

  expect(button).toBeEnabled();

  userEvent.clear(descriptionField);

  expect(button).toBeDisabled();
});

test('点击按钮后，生成并显示访问令牌', async () => {
  const token = '一个非常长的访问令牌应该显示出来';
  const onSubmit = jest.fn(() => Promise.resolve({ rawAPIKey: token }));

  const queries = renderComponent(onSubmit);

  const descriptionField = queries.getByLabelText('Description');

  userEvent.type(descriptionField, 'description');

  const button = queries.getByRole('button', { name: '添加访问令牌' });

  userEvent.click(button);

  expect(onSubmit).toHaveBeenCalledWith('description');
  expect(onSubmit).toHaveBeenCalledTimes(1);

  await expect(queries.findByText('新的访问令牌')).resolves.toBeVisible();
  expect(queries.getByText(token)).toHaveTextContent(token);
});

function renderComponent(onSubmit = jest.fn()) {
  const queries = render(
    <CreateAccessToken onSubmit={onSubmit} onError={jest.fn()} />
  );

  expect(queries.getByLabelText('Description')).toBeVisible();

  return queries;
}
