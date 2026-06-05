import { GitFormValues } from './types';
import { getGitValidationSchema } from './validation';

describe('Git validation', () => {
  it('should pass validation with valid git form values', async () => {
    const schema = getGitValidationSchema({
      gitCredentials: [],
    });

    const validData: GitFormValues = {
      RepositoryURL: 'https://github.com/user/repo',
      RepositoryReferenceName: 'refs/heads/main',
      ComposeFilePathInRepository: 'docker-compose.yml',
      RepositoryAuthentication: false,
      RepositoryUsername: '',
      RepositoryPassword: '',
      RepositoryGitCredentialID: 0,
      TLSSkipVerify: false,
      AdditionalFiles: [],
      AutoUpdate: undefined,
      RepositoryAuthorizationType: undefined,
      SupportRelativePath: false,
      FilesystemPath: '',
      SaveCredential: false,
      NewCredentialName: '',
    };

    await expect(schema.validate(validData)).resolves.toBeDefined();
  });

  it('should fail validation when repository URL is empty', async () => {
    const schema = getGitValidationSchema({
      gitCredentials: [],
    });

    const invalidData = {
      RepositoryURL: '',
      RepositoryReferenceName: 'refs/heads/main',
      ComposeFilePathInRepository: 'docker-compose.yml',
    };

    await expect(schema.validate(invalidData)).rejects.toThrow();
  });

  it('should require credential name when saveCredential is true', async () => {
    const schema = getGitValidationSchema({
      gitCredentials: [],
    });

    const invalidData: GitFormValues = {
      RepositoryURL: 'https://github.com/user/repo',
      RepositoryReferenceName: 'refs/heads/main',
      ComposeFilePathInRepository: 'docker-compose.yml',
      RepositoryAuthentication: true,
      RepositoryUsername: 'user',
      RepositoryPassword: 'pass',
      RepositoryGitCredentialID: 0,
      TLSSkipVerify: false,
      AdditionalFiles: [],
      AutoUpdate: undefined,
      RepositoryAuthorizationType: undefined,
      SupportRelativePath: false,
      FilesystemPath: '',
      SaveCredential: true,
      NewCredentialName: '',
    };

    await expect(schema.validate(invalidData)).rejects.toThrow();
  });
});
