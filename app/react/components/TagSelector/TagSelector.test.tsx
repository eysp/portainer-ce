import { Tag, TagId } from '@/portainer/tags/types';
import { renderWithQueryClient } from '@/react-tools/test-utils';
import { server, rest } from '@/setup-tests/server';

import { TagSelector } from './TagSelector';

test('当没有标签且allowCreate为false时，应显示一条消息', async () => {
  const { getByText } = await renderComponent({ allowCreate: false }, []);

  expect(
    getByText('没有可用的标签。请前往', {
      exact: false,
    })
  ).toBeInTheDocument();
});

test('应显示所选的标签', async () => {
  const tags: Tag[] = [
    {
      ID: 1,
      Name: 'tag1',
      Endpoints: {},
    },
    {
      ID: 2,
      Name: 'tag2',
      Endpoints: {},
    },
  ];

  const selectedTags = [tags[1]];

  const { getByText } = await renderComponent(
    { value: selectedTags.map((t) => t.ID) },
    tags
  );

  expect(getByText(selectedTags[0].Name)).toBeInTheDocument();
});
async function renderComponent(
  {
    value = [],
    allowCreate = false,
    onChange = jest.fn(),
  }: {
    value?: TagId[];
    allowCreate?: boolean;
    onChange?: jest.Mock;
  } = {},
  tags: Tag[] = []
) {
  server.use(rest.get('/api/tags', (_req, res, ctx) => res(ctx.json(tags))));

  const queries = renderWithQueryClient(
    <TagSelector value={value} allowCreate={allowCreate} onChange={onChange} />
  );

  const tagElement = await queries.findAllByText('tags', { exact: false });

  expect(tagElement.length).toBeGreaterThanOrEqual(1);

  return queries;
}
