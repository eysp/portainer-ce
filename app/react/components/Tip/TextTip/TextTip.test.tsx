import { render } from '@testing-library/react';

import { TextTip } from './TextTip';

test('应该显示带有子项的文本提示', async () => {
  const children = 'test text tip';
  const { findByText } = render(<TextTip>{children}</TextTip>);

  const heading = await findByText(children);
  expect(heading).toBeTruthy();
});
