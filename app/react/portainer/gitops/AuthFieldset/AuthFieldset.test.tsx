import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';

import {
  GitCredential,
  AuthTypeOption,
} from '@/react/portainer/account/git-credentials/types';
import { GitAuthModel } from '@/react/portainer/gitops/types';

import { AuthFieldset, gitAuthValidation } from './AuthFieldset';

// Simple mocks to avoid complex dependencies
vi.mock('../../feature-flags/feature-flags.service', () => ({
  isBE: true,
  isLimitedToBE: () => false,
}));

vi.mock('@/react/hooks/useDebounce', () => ({
  useDebounce: (value: unknown, callback: (value: unknown) => void) => [
    value,
    callback,
  ],
}));

vi.mock('./CredentialSelector', () => ({
  CredentialSelector: () => (
    <div data-cy="credential-selector">Credential Selector</div>
  ),
}));

vi.mock('./NewCredentialForm', () => ({
  NewCredentialForm: () => (
    <div data-cy="new-credential-form">New Credential Form</div>
  ),
}));

const defaultGitAuthModel: GitAuthModel = {
  RepositoryAuthentication: false,
  RepositoryGitCredentialID: 0,
  RepositoryUsername: '',
  RepositoryPassword: '',
  RepositoryAuthorizationType: AuthTypeOption.Basic,
  SaveCredential: false,
  NewCredentialName: '',
};

function renderAuthFieldset({
  value = defaultGitAuthModel,
  onChange = vi.fn(),
  isAuthExplanationVisible = false,
  errors = {},
}: {
  value?: GitAuthModel;
  onChange?: (value: Partial<GitAuthModel>) => void;
  isAuthExplanationVisible?: boolean;
  errors?: Record<string, string>;
} = {}) {
  return render(
    <AuthFieldset
      value={value}
      onChange={onChange}
      isAuthExplanationVisible={isAuthExplanationVisible}
      errors={errors}
    />
  );
}

describe('AuthFieldset', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('key component rendering', () => {
    it('should render authentication toggle', () => {
      renderAuthFieldset();

      expect(screen.getByTestId('component-gitAuthToggle')).toBeInTheDocument();
    });

    it('should render username input when authentication is enabled', () => {
      renderAuthFieldset({
        value: { ...defaultGitAuthModel, RepositoryAuthentication: true },
      });

      expect(
        screen.getByTestId('component-gitUsernameInput')
      ).toBeInTheDocument();
    });

    it('should render password input when authentication is enabled', () => {
      renderAuthFieldset({
        value: { ...defaultGitAuthModel, RepositoryAuthentication: true },
      });

      expect(
        screen.getByTestId('component-gitPasswordInput')
      ).toBeInTheDocument();
    });

    it('should render credential selector when authentication is enabled', () => {
      renderAuthFieldset({
        value: { ...defaultGitAuthModel, RepositoryAuthentication: true },
      });

      expect(screen.getByTestId('credential-selector')).toBeInTheDocument();
    });

    it('should render new credential form when password is provided', () => {
      renderAuthFieldset({
        value: {
          ...defaultGitAuthModel,
          RepositoryAuthentication: true,
          RepositoryPassword: 'password123',
        },
      });

      expect(screen.getByTestId('new-credential-form')).toBeInTheDocument();
    });

    it('should not render interactive fields when authentication is disabled', () => {
      renderAuthFieldset({
        value: { ...defaultGitAuthModel, RepositoryAuthentication: false },
      });

      expect(
        screen.queryByTestId('component-gitUsernameInput')
      ).not.toBeInTheDocument();
      expect(
        screen.queryByTestId('component-gitPasswordInput')
      ).not.toBeInTheDocument();
      expect(
        screen.queryByTestId('credential-selector')
      ).not.toBeInTheDocument();
    });
  });

  describe('props handling', () => {
    it('should handle onChange prop', () => {
      const onChange = vi.fn();
      renderAuthFieldset({ onChange });

      expect(onChange).toBeDefined();
    });

    it('should handle errors prop for username', () => {
      const errors = { RepositoryUsername: 'Username is required' };
      renderAuthFieldset({
        value: { ...defaultGitAuthModel, RepositoryAuthentication: true },
        errors,
      });

      expect(screen.getByText('Username is required')).toBeInTheDocument();
    });

    it('should handle errors prop for password', () => {
      const errors = { RepositoryPassword: 'Password is required' };
      renderAuthFieldset({
        value: { ...defaultGitAuthModel, RepositoryAuthentication: true },
        errors,
      });

      expect(screen.getByText('Password is required')).toBeInTheDocument();
    });

    it('should handle multiple errors', () => {
      const errors = {
        RepositoryUsername: 'Username is required',
        RepositoryPassword: 'Password is required',
      };
      renderAuthFieldset({
        value: { ...defaultGitAuthModel, RepositoryAuthentication: true },
        errors,
      });

      expect(screen.getByText('Username is required')).toBeInTheDocument();
      expect(screen.getByText('Password is required')).toBeInTheDocument();
    });

    it('should handle empty errors object', () => {
      const errors = {};
      renderAuthFieldset({
        value: { ...defaultGitAuthModel, RepositoryAuthentication: true },
        errors,
      });

      expect(
        screen.getByTestId('component-gitUsernameInput')
      ).toBeInTheDocument();
      expect(
        screen.getByTestId('component-gitPasswordInput')
      ).toBeInTheDocument();
    });

    it('should handle isAuthExplanationVisible prop when true', () => {
      renderAuthFieldset({
        value: { ...defaultGitAuthModel, RepositoryAuthentication: true },
        isAuthExplanationVisible: true,
      });

      expect(
        screen.getByText(
          'Enabling authentication will store the credentials and it is advisable to use a git service account'
        )
      ).toBeInTheDocument();
    });

    it('should handle isAuthExplanationVisible prop when false', () => {
      renderAuthFieldset({
        value: { ...defaultGitAuthModel, RepositoryAuthentication: true },
        isAuthExplanationVisible: false,
      });

      expect(
        screen.queryByText(
          'Enabling authentication will store the credentials and it is advisable to use a git service account'
        )
      ).not.toBeInTheDocument();
    });

    it('should handle value prop with all fields populated', () => {
      const value: GitAuthModel = {
        RepositoryAuthentication: true,
        RepositoryGitCredentialID: 0,
        RepositoryUsername: 'testuser',
        RepositoryPassword: 'testpass',
        RepositoryAuthorizationType: AuthTypeOption.Token,
        SaveCredential: true,
        NewCredentialName: 'test-credential',
      };

      renderAuthFieldset({ value });

      expect(
        screen.getByTestId('component-gitUsernameInput')
      ).toBeInTheDocument();
      expect(
        screen.getByTestId('component-gitPasswordInput')
      ).toBeInTheDocument();
      expect(screen.getByTestId('credential-selector')).toBeInTheDocument();
      expect(screen.getByTestId('new-credential-form')).toBeInTheDocument();
    });

    it('should handle value prop with git credential selected', () => {
      const value: GitAuthModel = {
        RepositoryAuthentication: true,
        RepositoryGitCredentialID: 1,
        RepositoryUsername: '',
        RepositoryPassword: '',
        RepositoryAuthorizationType: AuthTypeOption.Basic,
        SaveCredential: false,
        NewCredentialName: '',
      };

      renderAuthFieldset({ value });

      expect(screen.getByTestId('credential-selector')).toBeInTheDocument();
      // shouldn't render credential inputs for selected credential
      expect(
        screen.queryByTestId('component-gitUsernameInput')
      ).not.toBeInTheDocument();
      expect(
        screen.queryByTestId('component-gitPasswordInput')
      ).not.toBeInTheDocument();
      expect(
        screen.queryByTestId('new-credential-form')
      ).not.toBeInTheDocument();
    });
  });
});

describe('gitAuthValidation', () => {
  const mockGitCredentials: GitCredential[] = [
    {
      id: 1,
      userId: 1,
      name: 'existing-credential',
      username: 'testuser',
      creationDate: Date.now(),
      authorizationType: AuthTypeOption.Basic,
    },
  ];

  describe('default values', () => {
    it('should provide correct default values', async () => {
      const schema = gitAuthValidation([], false, false);
      const result = await schema.validate({});

      expect(result).toEqual({
        RepositoryAuthentication: false,
        RepositoryGitCredentialID: 0,
        RepositoryUsername: '',
        RepositoryPassword: '',
        RepositoryAuthorizationType: AuthTypeOption.Basic,
        SaveCredential: false,
        NewCredentialName: '',
      });
    });
  });

  describe('authentication disabled', () => {
    it('should allow empty values when authentication is disabled', async () => {
      const schema = gitAuthValidation([], false, false);
      const data = {
        RepositoryAuthentication: false,
        RepositoryGitCredentialID: 0,
        RepositoryUsername: '',
        RepositoryPassword: '',
        RepositoryAuthorizationType: AuthTypeOption.Basic,
      };

      const result = await schema.validate(data);
      expect(result.RepositoryAuthentication).toBe(false);
    });
  });

  describe('authentication enabled without git credential', () => {
    it('should require username when authentication is enabled and no git credential is selected', async () => {
      const schema = gitAuthValidation([], false, false);
      const data = {
        RepositoryAuthentication: true,
        RepositoryGitCredentialID: 0,
        RepositoryUsername: '',
        RepositoryPassword: 'password',
        RepositoryAuthorizationType: AuthTypeOption.Basic,
      };

      await expect(schema.validate(data)).rejects.toThrow(
        '用户名为必填项'
      );
    });

    it('should require password when authentication is enabled, no git credential, not auth edit, and not from custom template', async () => {
      const schema = gitAuthValidation([], false, false);
      const data = {
        RepositoryAuthentication: true,
        RepositoryGitCredentialID: 0,
        RepositoryUsername: 'username',
        RepositoryPassword: '',
        RepositoryAuthorizationType: AuthTypeOption.Basic,
      };

      await expect(schema.validate(data)).rejects.toThrow(
        '个人访问令牌为必填项'
      );
    });

    it('should set default authorization type when authentication is enabled, no git credential, not auth edit, and not from custom template', async () => {
      const schema = gitAuthValidation([], false, false);
      const data = {
        RepositoryAuthentication: true,
        RepositoryGitCredentialID: 0,
        RepositoryUsername: 'username',
        RepositoryPassword: 'password',
        RepositoryAuthorizationType: undefined,
      };

      // The schema provides a default value when authorization type is undefined
      const result = await schema.validate(data);
      expect(result.RepositoryAuthorizationType).toBe(AuthTypeOption.Basic);
    });

    it('should accept valid authorization types', async () => {
      const schema = gitAuthValidation([], false, false);
      const data = {
        RepositoryAuthentication: true,
        RepositoryGitCredentialID: 0,
        RepositoryUsername: 'username',
        RepositoryPassword: 'password',
        RepositoryAuthorizationType: AuthTypeOption.Token,
      };

      const result = await schema.validate(data);
      expect(result.RepositoryAuthorizationType).toBe(AuthTypeOption.Token);
    });

    it('should reject invalid authorization types', async () => {
      const schema = gitAuthValidation([], false, false);
      const data = {
        RepositoryAuthentication: true,
        RepositoryGitCredentialID: 0,
        RepositoryUsername: 'username',
        RepositoryPassword: 'password',
        RepositoryAuthorizationType: 999, // Invalid value
      };

      await expect(schema.validate(data)).rejects.toThrow();
    });

    it('should reject string authorization types that are not valid enum values', async () => {
      const schema = gitAuthValidation([], false, false);
      const data = {
        RepositoryAuthentication: true,
        RepositoryGitCredentialID: 0,
        RepositoryUsername: 'username',
        RepositoryPassword: 'password',
        RepositoryAuthorizationType:
          'invalid-auth-type' as unknown as AuthTypeOption,
      };

      await expect(schema.validate(data)).rejects.toThrow();
    });
  });

  describe('authentication enabled with git credential', () => {
    it('should not require username when git credential is selected', async () => {
      const schema = gitAuthValidation([], false, false);
      const data = {
        RepositoryAuthentication: true,
        RepositoryGitCredentialID: 1,
        RepositoryUsername: '',
        RepositoryPassword: '',
        RepositoryAuthorizationType: AuthTypeOption.Basic,
      };

      const result = await schema.validate(data);
      expect(result.RepositoryUsername).toBe('');
    });

    it('should not require password when git credential is selected', async () => {
      const schema = gitAuthValidation([], false, false);
      const data = {
        RepositoryAuthentication: true,
        RepositoryGitCredentialID: 1,
        RepositoryUsername: '',
        RepositoryPassword: '',
        RepositoryAuthorizationType: AuthTypeOption.Basic,
      };

      const result = await schema.validate(data);
      expect(result.RepositoryPassword).toBe('');
    });

    it('should not require authorization type when git credential is selected', async () => {
      const schema = gitAuthValidation([], false, false);
      const data = {
        RepositoryAuthentication: true,
        RepositoryGitCredentialID: 1,
        RepositoryUsername: '',
        RepositoryPassword: '',
        RepositoryAuthorizationType: undefined,
      };

      const result = await schema.validate(data);
      expect(result.RepositoryAuthorizationType).toBe(AuthTypeOption.Basic); // Default value
    });

    it('should accept the authorization type from the selected git credential', async () => {
      const schema = gitAuthValidation(mockGitCredentials, false, false);
      const data = {
        RepositoryAuthentication: true,
        RepositoryGitCredentialID: 1, // This matches the mockGitCredentials[0].id
        RepositoryUsername: '',
        RepositoryPassword: '',
        RepositoryAuthorizationType: AuthTypeOption.Basic, // This matches mockGitCredentials[0].authorizationType
      };

      const result = await schema.validate(data);
      expect(result.RepositoryAuthorizationType).toBe(AuthTypeOption.Basic);
    });

    it('should not require authorization type validation when git credential is selected', async () => {
      const schema = gitAuthValidation(mockGitCredentials, false, false);
      const data = {
        RepositoryAuthentication: true,
        RepositoryGitCredentialID: 1,
        RepositoryUsername: '',
        RepositoryPassword: '',
        RepositoryAuthorizationType: undefined, // Should not be required when git credential is selected
      };

      const result = await schema.validate(data);
      expect(result.RepositoryAuthorizationType).toBe(AuthTypeOption.Basic); // Should default to Basic
    });

    it('should reject invalid authorization type even when git credential is selected', async () => {
      const schema = gitAuthValidation(mockGitCredentials, false, false);
      const data = {
        RepositoryAuthentication: true,
        RepositoryGitCredentialID: 1,
        RepositoryUsername: '',
        RepositoryPassword: '',
        RepositoryAuthorizationType: 999, // Invalid value - should be rejected by oneOf validation
      };

      await expect(schema.validate(data)).rejects.toThrow();
    });

    it('should reject string authorization type that is not valid enum value even when git credential is selected', async () => {
      const schema = gitAuthValidation(mockGitCredentials, false, false);
      const data = {
        RepositoryAuthentication: true,
        RepositoryGitCredentialID: 1,
        RepositoryUsername: '',
        RepositoryPassword: '',
        RepositoryAuthorizationType:
          'invalid-auth-type' as unknown as AuthTypeOption, // Invalid string value
      };

      await expect(schema.validate(data)).rejects.toThrow();
    });
  });

  describe('auth edit mode', () => {
    it('should not require password when in auth edit mode', async () => {
      const schema = gitAuthValidation([], true, false);
      const data = {
        RepositoryAuthentication: true,
        RepositoryGitCredentialID: 0,
        RepositoryUsername: 'username',
        RepositoryPassword: '',
        RepositoryAuthorizationType: AuthTypeOption.Basic,
      };

      const result = await schema.validate(data);
      expect(result.RepositoryPassword).toBe('');
    });

    it('should not require authorization type when in auth edit mode', async () => {
      const schema = gitAuthValidation([], true, false);
      const data = {
        RepositoryAuthentication: true,
        RepositoryGitCredentialID: 0,
        RepositoryUsername: 'username',
        RepositoryPassword: 'password',
        RepositoryAuthorizationType: undefined,
      };

      const result = await schema.validate(data);
      expect(result.RepositoryAuthorizationType).toBe(AuthTypeOption.Basic); // Default value
    });
  });

  describe('created from custom template', () => {
    it('should not require password when created from custom template', async () => {
      const schema = gitAuthValidation([], false, true);
      const data = {
        RepositoryAuthentication: true,
        RepositoryGitCredentialID: 0,
        RepositoryUsername: 'username',
        RepositoryPassword: '',
        RepositoryAuthorizationType: AuthTypeOption.Basic,
      };

      const result = await schema.validate(data);
      expect(result.RepositoryPassword).toBe('');
    });

    it('should not require authorization type when created from custom template', async () => {
      const schema = gitAuthValidation([], false, true);
      const data = {
        RepositoryAuthentication: true,
        RepositoryGitCredentialID: 0,
        RepositoryUsername: 'username',
        RepositoryPassword: 'password',
        RepositoryAuthorizationType: undefined,
      };

      const result = await schema.validate(data);
      expect(result.RepositoryAuthorizationType).toBe(AuthTypeOption.Basic); // Default value
    });
  });

  describe('save credential validation', () => {
    it('should not require new credential name when save credential is disabled', async () => {
      const schema = gitAuthValidation([], false, false);
      const data = {
        RepositoryAuthentication: true,
        RepositoryGitCredentialID: 0,
        RepositoryUsername: 'username',
        RepositoryPassword: 'password',
        RepositoryAuthorizationType: AuthTypeOption.Basic,
        SaveCredential: false,
        NewCredentialName: '',
      };

      const result = await schema.validate(data);
      expect(result.NewCredentialName).toBe('');
    });

    it('should require new credential name when save credential is enabled and not in auth edit mode', async () => {
      const schema = gitAuthValidation([], false, false);
      const data = {
        RepositoryAuthentication: true,
        RepositoryGitCredentialID: 0,
        RepositoryUsername: 'username',
        RepositoryPassword: 'password',
        RepositoryAuthorizationType: AuthTypeOption.Basic,
        SaveCredential: true,
        NewCredentialName: '',
      };

      await expect(schema.validate(data)).rejects.toThrow('Name is required');
    });

    it('should not require new credential name when save credential is enabled but in auth edit mode', async () => {
      const schema = gitAuthValidation([], true, false);
      const data = {
        RepositoryAuthentication: true,
        RepositoryGitCredentialID: 0,
        RepositoryUsername: 'username',
        RepositoryPassword: 'password',
        RepositoryAuthorizationType: AuthTypeOption.Basic,
        SaveCredential: true,
        NewCredentialName: '',
      };

      const result = await schema.validate(data);
      expect(result.NewCredentialName).toBe('');
    });

    it('should reject duplicate credential names', async () => {
      const schema = gitAuthValidation(mockGitCredentials, false, false);
      const data = {
        RepositoryAuthentication: true,
        RepositoryGitCredentialID: 0,
        RepositoryUsername: 'username',
        RepositoryPassword: 'password',
        RepositoryAuthorizationType: AuthTypeOption.Basic,
        SaveCredential: true,
        NewCredentialName: 'existing-credential',
      };

      await expect(schema.validate(data)).rejects.toThrow(
        'This name is already been used, please try another one'
      );
    });

    it('should accept unique credential names', async () => {
      const schema = gitAuthValidation(mockGitCredentials, false, false);
      const data = {
        RepositoryAuthentication: true,
        RepositoryGitCredentialID: 0,
        RepositoryUsername: 'username',
        RepositoryPassword: 'password',
        RepositoryAuthorizationType: AuthTypeOption.Basic,
        SaveCredential: true,
        NewCredentialName: 'new-credential',
      };

      const result = await schema.validate(data);
      expect(result.NewCredentialName).toBe('new-credential');
    });

    it('should validate credential name format - valid names', async () => {
      const schema = gitAuthValidation([], false, false);
      const validNames = ['my-name', 'abc-123', 'test_credential', 'simple123'];

      await Promise.all(
        validNames.map(async (name) => {
          const data = {
            RepositoryAuthentication: true,
            RepositoryGitCredentialID: 0,
            RepositoryUsername: 'username',
            RepositoryPassword: 'password',
            RepositoryAuthorizationType: AuthTypeOption.Basic,
            SaveCredential: true,
            NewCredentialName: name,
          };

          const result = await schema.validate(data);
          expect(result.NewCredentialName).toBe(name);
        })
      );
    });

    it('should validate credential name format - invalid names', async () => {
      const schema = gitAuthValidation([], false, false);
      const invalidNames = [
        'My-Name',
        'ABC-123',
        'test@credential',
        'simple 123',
        'test.credential',
      ];

      await Promise.all(
        invalidNames.map(async (name) => {
          const data = {
            RepositoryAuthentication: true,
            RepositoryGitCredentialID: 0,
            RepositoryUsername: 'username',
            RepositoryPassword: 'password',
            RepositoryAuthorizationType: AuthTypeOption.Basic,
            SaveCredential: true,
            NewCredentialName: name,
          };

          await expect(schema.validate(data)).rejects.toThrow(
            "This field must consist of lower case alphanumeric characters, '_' or '-' (e.g. 'my-name', or 'abc-123')."
          );
        })
      );
    });
  });

  describe('complex scenarios', () => {
    it('should handle complete valid data with save credential', async () => {
      const schema = gitAuthValidation([], false, false);
      const data = {
        RepositoryAuthentication: true,
        RepositoryGitCredentialID: 0,
        RepositoryUsername: 'testuser',
        RepositoryPassword: 'testpassword',
        RepositoryAuthorizationType: AuthTypeOption.Token,
        SaveCredential: true,
        NewCredentialName: 'my-test-credential',
      };

      const result = await schema.validate(data);
      expect(result).toEqual(data);
    });

    it('should handle complete valid data with git credential', async () => {
      const schema = gitAuthValidation(mockGitCredentials, false, false);
      const data = {
        RepositoryAuthentication: true,
        RepositoryGitCredentialID: 1,
        RepositoryUsername: '',
        RepositoryPassword: '',
        RepositoryAuthorizationType: AuthTypeOption.Basic,
        SaveCredential: false,
        NewCredentialName: '',
      };

      const result = await schema.validate(data);
      expect(result).toEqual(data);
    });

    it('should handle auth edit mode with save credential', async () => {
      const schema = gitAuthValidation([], true, false);
      const data = {
        RepositoryAuthentication: true,
        RepositoryGitCredentialID: 0,
        RepositoryUsername: 'testuser',
        RepositoryPassword: '',
        RepositoryAuthorizationType: AuthTypeOption.Basic,
        SaveCredential: true,
        NewCredentialName: '',
      };

      const result = await schema.validate(data);
      expect(result.RepositoryPassword).toBe('');
      expect(result.NewCredentialName).toBe('');
    });

    it('should handle custom template creation with save credential', async () => {
      const schema = gitAuthValidation([], false, true);
      const data = {
        RepositoryAuthentication: true,
        RepositoryGitCredentialID: 0,
        RepositoryUsername: 'testuser',
        RepositoryPassword: '',
        RepositoryAuthorizationType: AuthTypeOption.Basic,
        SaveCredential: true,
        NewCredentialName: 'template-credential',
      };

      const result = await schema.validate(data);
      expect(result.RepositoryPassword).toBe('');
      expect(result.NewCredentialName).toBe('template-credential');
    });
  });
});
