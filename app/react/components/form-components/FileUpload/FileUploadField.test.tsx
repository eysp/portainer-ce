import { fireEvent, render } from '@testing-library/react';

import { FileUploadField } from './FileUploadField';

test('render should make the file button clickable and fire onChange event after click', async () => {
  const onClick = vi.fn();
  const { findByText, findByTestId } = render(
    <FileUploadField
      title="test button"
      data-cy="file-upload"
      onChange={onClick}
      inputId="file-field"
    />
  );

  const button = await findByText('test button');
  expect(button).toBeVisible();

  const input = await findByTestId('file-upload-input');
  expect(input).not.toBeNull();

  const mockFile = new File([], 'file.txt');
  if (input) {
    fireEvent.change(input, {
      target: { files: [mockFile] },
    });
  }
  expect(onClick).toHaveBeenCalledWith(mockFile);
});
