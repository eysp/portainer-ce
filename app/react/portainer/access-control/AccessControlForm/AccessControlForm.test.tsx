import { server, rest } from '@/setup-tests/server';
import { UserContext } from '@/react/hooks/useUser';
import { UserViewModel } from '@/portainer/models/user';
import { renderWithQueryClient, within } from '@/react-tools/test-utils';
import { Team, TeamId } from '@/react/portainer/users/teams/types';
import { createMockTeams } from '@/react-tools/test-mocks';
import { UserId } from '@/portainer/users/types';

import { ResourceControlOwnership, AccessControlFormData } from '../types';
import { ResourceControlViewModel } from '../models/ResourceControlViewModel';

import { AccessControlForm } from './AccessControlForm';

test('renders correctly', async () => {
  const values = buildFormData();

  const { findByText } = await renderComponent(values);

  expect(await findByText('访问控制')).toBeVisible();
});

test.each([
  [ResourceControlOwnership.ADMINISTRATORS],
  [ResourceControlOwnership.PRIVATE],
  [ResourceControlOwnership.RESTRICTED],
])(
  `当所有权为 %s 时，所有权选择器应可见`,
  async (ownership) => {
    const values = buildFormData(ownership);

    const { findByRole, getByLabelText } = await renderComponent(values);
    const accessSwitch = getByLabelText(/启用访问控制/);

    expect(accessSwitch).toBeEnabled();

    await expect(findByRole('radiogroup')).resolves.toBeVisible();
  }
);

test.each([
  [ResourceControlOwnership.ADMINISTRATORS],
  [ResourceControlOwnership.PRIVATE],
  [ResourceControlOwnership.RESTRICTED],
])(
  '当 isAdmin 为 true 且所有权为 %s 时，所有权选择器应显示管理员和受限选项',
  async (ownership) => {
    const values = buildFormData(ownership);

    const { findByRole } = await renderComponent(values, jest.fn(), {
      isAdmin: true,
    });

    const ownershipSelector = await findByRole('radiogroup');

    expect(ownershipSelector).toBeVisible();
    if (!ownershipSelector) {
      throw new Error('选择器缺失');
    }

    const selectorQueries = within(ownershipSelector);
    expect(
      await selectorQueries.findByLabelText(/管理员/)
    ).toBeVisible();
    expect(await selectorQueries.findByLabelText(/受限/)).toBeVisible();
  }
);

test.each([
  [ResourceControlOwnership.ADMINISTRATORS],
  [ResourceControlOwnership.PRIVATE],
  [ResourceControlOwnership.RESTRICTED],
])(
  `当用户不是管理员且所有权为 %s 时，且没有团队时，应只有私有选项可见`,
  async (ownership) => {
    const values = buildFormData(ownership);

    const { findByRole } = await renderComponent(values, jest.fn(), {
      teams: [],
      isAdmin: false,
    });

    const ownershipSelector = await findByRole('radiogroup');

    const selectorQueries = within(ownershipSelector);

    expect(selectorQueries.queryByLabelText(/私有/)).toBeVisible();
    expect(selectorQueries.queryByLabelText(/受限/)).toBeNull();
  }
);

test.each([
  [ResourceControlOwnership.ADMINISTRATORS],
  [ResourceControlOwnership.PRIVATE],
  [ResourceControlOwnership.RESTRICTED],
])(
  `当用户不是管理员且所有权为 %s 时，且有 1 个团队时，应有私有和受限选项可见`,
  async (ownership) => {
    const values = buildFormData(ownership);

    const { findByRole } = await renderComponent(values, jest.fn(), {
      teams: createMockTeams(1),
      isAdmin: false,
    });

    const ownershipSelector = await findByRole('radiogroup');

    const selectorQueries = within(ownershipSelector);

    expect(await selectorQueries.findByLabelText(/私有/)).toBeVisible();
    expect(await selectorQueries.findByLabelText(/受限/)).toBeVisible();
  }
);

test('当所有权为公开时，所有权选择器应该隐藏', async () => {
  const values = buildFormData(ResourceControlOwnership.PUBLIC);

  const { queryByRole } = await renderComponent(values);

  expect(queryByRole('radiogroup')).toBeNull();
});

test('当 hideTitle 为 true 时，标题应该隐藏', async () => {
  const values = buildFormData();

  const { queryByRole } = await renderComponent(values, jest.fn(), {
    hideTitle: true,
  });

  expect(queryByRole('Access control')).toBeNull();
});

test('当 isAdmin 为 true 且选择了管理员所有权时，不应有其他选项可见', async () => {
  const values = buildFormData(ResourceControlOwnership.ADMINISTRATORS);

  const { findByRole, queryByLabelText } = await renderComponent(
    values,
    jest.fn(),
    {
      isAdmin: true,
    }
  );

  const ownershipSelector = await findByRole('radiogroup');

  expect(ownershipSelector).toBeVisible();
  if (!ownershipSelector) {
    throw new Error('选择器缺失');
  }

  const selectorQueries = within(ownershipSelector);

  expect(await selectorQueries.findByLabelText(/Administrator/)).toBeChecked();
  expect(await selectorQueries.findByLabelText(/受限的/)).not.toBeChecked();

  expect(queryByLabelText('extra-options')).toBeNull();
});

test('当 isAdmin 为 true 且选择了限制所有权时，应显示团队和用户选择器', async () => {
  const values = buildFormData(ResourceControlOwnership.RESTRICTED);

  const { findByRole, findByLabelText } = await renderComponent(
    values,
    jest.fn(),
    {
      isAdmin: true,
    }
  );

  const ownershipSelector = await findByRole('radiogroup');

  expect(ownershipSelector).toBeVisible();
  if (!ownershipSelector) {
    throw new Error('选择器缺失');
  }

  const selectorQueries = within(ownershipSelector);

  expect(
    await selectorQueries.findByLabelText(/管理员/)
  ).not.toBeChecked();

  expect(await selectorQueries.findByLabelText(/受限的/)).toBeChecked();

  const extraOptions = await findByLabelText('extra-options');
  expect(extraOptions).toBeVisible();

  if (!extraOptions) {
    throw new Error('附加选项部分缺失');
  }

  const extraQueries = within(extraOptions);
  expect(await extraQueries.findByText(/授权用户/)).toBeVisible();
  expect(await extraQueries.findByText(/授权团队/)).toBeVisible();
});

test('当用户不是管理员，团队数量超过1个且所有权被限制时，团队选择器应该可见', async () => {
  const values = buildFormData(ResourceControlOwnership.RESTRICTED);

  const { findByRole, findByLabelText } = await renderComponent(
    values,
    jest.fn()
  );

  const ownershipSelector = await findByRole('radiogroup');

  expect(ownershipSelector).toBeVisible();
  if (!ownershipSelector) {
    throw new Error('选择器缺失');
  }

  const selectorQueries = within(ownershipSelector);

  expect(await selectorQueries.findByLabelText(/私有的/)).toBeVisible();
  expect(await selectorQueries.findByLabelText(/受限的/)).toBeVisible();

  const extraOptions = await findByLabelText('extra-options');
  expect(extraOptions).toBeVisible();

  if (!extraOptions) {
    throw new Error('附加选项部分缺失');
  }

  const extraQueries = within(extraOptions);
  expect(extraQueries.queryByLabelText(/授权团队/)).toBeVisible();
});

test('当用户不是管理员，团队数量为1个且所有权被限制时，团队选择器不应该可见', async () => {
  const values = buildFormData(ResourceControlOwnership.RESTRICTED);

  const { findByRole, findByLabelText } = await renderComponent(
    values,
    jest.fn(),
    {
      teams: createMockTeams(1),
      isAdmin: false,
    }
  );

  const ownershipSelector = await findByRole('radiogroup');

  expect(ownershipSelector).toBeVisible();
  if (!ownershipSelector) {
    throw new Error('选择器缺失');
  }

  const selectorQueries = within(ownershipSelector);

  expect(await selectorQueries.findByLabelText(/私有的/)).toBeVisible();
  expect(await selectorQueries.findByLabelText(/受限的/)).toBeVisible();

  const extraOptions = await findByLabelText('extra-options');
  expect(extraOptions).toBeVisible();

  if (!extraOptions) {
    throw new Error('附加选项部分缺失');
  }

  const extraQueries = within(extraOptions);
  expect(extraQueries.queryByText(/授权团队/)).toBeNull();
});

test('当用户不是管理员且所有权被限制时，用户选择器不应该可见', async () => {
  const values = buildFormData(ResourceControlOwnership.RESTRICTED);

  const { findByRole, findByLabelText } = await renderComponent(
    values,
    jest.fn(),
    {
      isAdmin: false,
    }
  );

  const ownershipSelector = await findByRole('radiogroup');

  expect(ownershipSelector).toBeVisible();
  if (!ownershipSelector) {
    throw new Error('选择器缺失');
  }

  const extraOptions = await findByLabelText('extra-options');
  expect(extraOptions).toBeVisible();

  if (!extraOptions) {
    throw new Error('附加选项部分缺失');
  }
  const extraQueries = within(extraOptions);

  expect(extraQueries.queryByText(/授权用户/)).toBeNull();
});

interface AdditionalProps {
  teams?: Team[];
  users?: UserViewModel[];
  isAdmin?: boolean;
  hideTitle?: boolean;
  resourceControl?: ResourceControlViewModel;
}

async function renderComponent(
  values: AccessControlFormData,
  onChange = jest.fn(),
  { isAdmin = false, hideTitle = false, teams, users }: AdditionalProps = {}
) {
  const user = new UserViewModel({ Username: 'user', Role: isAdmin ? 1 : 2 });
  const state = { user };

  if (teams) {
    server.use(rest.get('/api/teams', (req, res, ctx) => res(ctx.json(teams))));
  }

  if (users) {
    server.use(rest.get('/api/users', (req, res, ctx) => res(ctx.json(users))));
  }

  const renderResult = renderWithQueryClient(
    <UserContext.Provider value={state}>
      <AccessControlForm
        errors={{}}
        values={values}
        onChange={onChange}
        hideTitle={hideTitle}
      />
    </UserContext.Provider>
  );

  await expect(
    renderResult.findByLabelText(/启用访问控制/)
  ).resolves.toBeVisible();
  return renderResult;
}

function buildFormData(
  ownership = ResourceControlOwnership.PRIVATE,
  authorizedTeams: TeamId[] = [],
  authorizedUsers: UserId[] = []
): AccessControlFormData {
  return { ownership, authorizedTeams, authorizedUsers };
}
