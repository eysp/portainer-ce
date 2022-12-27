import { UserContext } from '@/portainer/hooks/useUser';
import { UserViewModel } from '@/portainer/models/user';
import { renderWithQueryClient } from '@/react-tools/test-utils';

import { TeamMembersList } from './TeamMembersList';

test('renders correctly', () => {
  const queries = renderComponent();

  expect(queries).toBeTruthy();
});

function renderComponent() {
  const user = new UserViewModel({ Username: 'user' });

  return renderWithQueryClient(
    <UserContext.Provider value={{ user }}>
      <TeamMembersList users={[]} roles={{}} teamId={3} />
    </UserContext.Provider>
  );
}

test.todo('当用户列表为空时，“添加所有用户”按钮被禁用');
test.todo('筛选器显示预期用户');
