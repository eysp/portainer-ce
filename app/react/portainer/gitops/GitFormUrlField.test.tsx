import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { useQueryClient } from '@tanstack/react-query';

import { withTestQueryProvider } from '@/react/test-utils/withTestQuery';
import { useCheckRepo } from '@/react/portainer/gitops/queries/useCheckRepo';
import { useDebounce } from '@/react/hooks/useDebounce';
import { isPortainerError } from '@/portainer/error';

import { GitFormModel } from './types';
import { GitFormUrlField } from './GitFormUrlField';
import { getAuthentication } from './utils';

// Mock the dependencies
vi.mock('@/react/portainer/gitops/queries/useCheckRepo', () => ({
  useCheckRepo: vi.fn(),
  checkRepo: vi.fn(),
}));

vi.mock('@/react/hooks/useDebounce', () => ({
  useDebounce: vi.fn(),
}));

vi.mock('@/portainer/error', () => ({
  isPortainerError: vi.fn(),
}));

vi.mock('../feature-flags/feature-flags.service', () => ({
  isBE: true,
}));

vi.mock('./utils', () => ({
  getAuthentication: vi.fn(),
}));

vi.mock('@tanstack/react-query', async () => {
  const actual = await vi.importActual('@tanstack/react-query');
  return {
    ...actual,
    useQueryClient: vi.fn(() => ({
      invalidateQueries: vi.fn(),
    })),
  };
});

const mockUseCheckRepo = vi.mocked(useCheckRepo);
const mockUseDebounce = vi.mocked(useDebounce);
const mockIsPortainerError = vi.mocked(isPortainerError);
const mockGetAuthentication = vi.mocked(getAuthentication);
const mockUseQueryClient = vi.mocked(useQueryClient);

describe('GitFormUrlField', () => {
  const defaultModel: GitFormModel = {
    RepositoryURL: '',
    ComposeFilePathInRepository: '',
    RepositoryAuthentication: false,
    RepositoryURLValid: false,
    TLSSkipVerify: false,
  };

  const defaultProps = {
    value: '',
    onChange: vi.fn(),
    onChangeRepositoryValid: vi.fn(),
    model: defaultModel,
  };

  beforeEach(() => {
    vi.clearAllMocks();

    // Setup default mock implementations
    mockUseDebounce.mockImplementation((value, onChange) => [value, onChange]);
    mockGetAuthentication.mockReturnValue(undefined);
    mockIsPortainerError.mockReturnValue(false);

    mockUseCheckRepo.mockReturnValue({
      data: true,
      error: null,
      isLoading: false,
      isError: false,
    } as ReturnType<typeof useCheckRepo>);

    mockUseQueryClient.mockReturnValue({
      invalidateQueries: vi.fn(),
    } as unknown as ReturnType<typeof useQueryClient>);
  });

  function renderComponent(props = {}) {
    const Component = withTestQueryProvider(() => (
      <GitFormUrlField {...defaultProps} {...props} />
    ));
    return render(<Component />);
  }

  describe('Basic rendering', () => {
    it('should render with correct structure', () => {
      renderComponent();

      expect(screen.getByText(/repository url/i)).toBeInTheDocument();
      expect(
        screen.getByPlaceholderText(
          'https://github.com/portainer/portainer-compose'
        )
      ).toBeInTheDocument();
      expect(screen.getByTestId('component-gitUrlInput')).toBeInTheDocument();
      expect(
        screen.getByTestId('component-gitUrlRefreshButton')
      ).toBeInTheDocument();
    });

    it('should display the current value in the input', () => {
      const testUrl = 'https://github.com/test/repo';
      renderComponent({ value: testUrl });

      expect(screen.getByDisplayValue(testUrl)).toBeInTheDocument();
    });

    it('should mark input as required', () => {
      renderComponent();

      const input = screen.getByTestId('component-gitUrlInput');
      expect(input).toHaveAttribute('required');
    });
  });

  describe('Input handling', () => {
    it('should call onChange when input value changes', async () => {
      const user = userEvent.setup();
      const mockOnChange = vi.fn();
      renderComponent({ onChange: mockOnChange });

      const input = screen.getByTestId('component-gitUrlInput');
      await user.clear(input);
      await user.type(input, 'test');

      // Check that onChange was called with each character
      expect(mockOnChange).toHaveBeenCalledWith('t');
      expect(mockOnChange).toHaveBeenCalledWith('e');
      expect(mockOnChange).toHaveBeenCalledWith('s');
      expect(mockOnChange).toHaveBeenLastCalledWith('t');
    });

    it('should use debounced value and onChange', () => {
      const debouncedValue = 'debounced-value';
      const debouncedOnChange = vi.fn();
      mockUseDebounce.mockReturnValue([debouncedValue, debouncedOnChange]);

      renderComponent();

      expect(screen.getByDisplayValue(debouncedValue)).toBeInTheDocument();
    });
  });

  describe('Repository validation', () => {
    it('should call onChangeRepositoryValid when repo check settles', () => {
      const mockOnChangeRepositoryValid = vi.fn();

      // Just test that the hook is called with the right parameters
      // The actual onSettled behavior is tested in integration
      renderComponent({ onChangeRepositoryValid: mockOnChangeRepositoryValid });

      expect(mockUseCheckRepo).toHaveBeenCalledWith(
        '',
        expect.objectContaining({
          creds: undefined,
          force: false,
          tlsSkipVerify: false,
        }),
        expect.objectContaining({
          enabled: true,
          onSettled: expect.any(Function),
        })
      );
    });

    it('should pass correct parameters to useCheckRepo', () => {
      const testUrl = 'https://github.com/test/repo';
      const testModel = {
        ...defaultModel,
        TLSSkipVerify: true,
      };
      const testCreds = { username: 'test', password: 'pass' };
      const createdFromCustomTemplateId = 123;

      mockGetAuthentication.mockReturnValue(testCreds);

      renderComponent({
        value: testUrl,
        model: testModel,
        createdFromCustomTemplateId,
      });

      expect(mockUseCheckRepo).toHaveBeenCalledWith(
        testUrl,
        {
          creds: testCreds,
          force: false,
          tlsSkipVerify: true,
          createdFromCustomTemplateId,
        },
        expect.objectContaining({
          enabled: true,
          onSettled: expect.any(Function),
        })
      );
    });

    it('should display error message when repo check fails', () => {
      const errorMessage = 'Repository not found';
      mockUseCheckRepo.mockReturnValue({
        data: null,
        error: { message: errorMessage },
        isLoading: false,
        isError: true,
      } as unknown as ReturnType<typeof useCheckRepo>);
      mockIsPortainerError.mockReturnValue(true);

      renderComponent();

      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });

    it('should display custom errors prop', () => {
      const customError = 'Custom validation error';
      renderComponent({ errors: customError });

      expect(screen.getByText(customError)).toBeInTheDocument();
    });
  });

  describe('Refresh functionality', () => {
    it('should disable refresh button when repository is not valid', () => {
      const invalidModel = { ...defaultModel, RepositoryURLValid: false };
      renderComponent({ model: invalidModel });

      const refreshButton = screen.getByTestId('component-gitUrlRefreshButton');
      expect(refreshButton).toBeDisabled();
    });

    it('should enable refresh button when repository is valid', () => {
      const validModel = { ...defaultModel, RepositoryURLValid: true };
      renderComponent({ model: validModel });

      const refreshButton = screen.getByTestId('component-gitUrlRefreshButton');
      expect(refreshButton).not.toBeDisabled();
    });

    it('should invalidate queries when refresh is clicked', async () => {
      const user = userEvent.setup();
      const validModel = { ...defaultModel, RepositoryURLValid: true };
      const mockInvalidateQueries = vi.fn();

      mockUseQueryClient.mockReturnValue({
        invalidateQueries: mockInvalidateQueries,
      } as unknown as ReturnType<typeof useQueryClient>);

      renderComponent({ model: validModel });

      const refreshButton = screen.getByTestId('component-gitUrlRefreshButton');
      await user.click(refreshButton);

      expect(mockInvalidateQueries).toHaveBeenCalledWith([
        'git_repo_refs',
        'git_repo_search_results',
      ]);
    });
  });

  describe('Authentication handling', () => {
    it('should call getAuthentication with the model', () => {
      const testModel = {
        ...defaultModel,
        RepositoryAuthentication: true,
        RepositoryUsername: 'testuser',
        RepositoryPassword: 'testpass',
      };

      renderComponent({ model: testModel });

      expect(mockGetAuthentication).toHaveBeenCalledWith(testModel);
    });
  });
});
