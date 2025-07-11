import { confirm } from '@@/modals/confirm';

import { GitFormModel } from './types';

export function getAuthentication(
  model: Pick<
    GitFormModel,
    | 'RepositoryAuthentication'
    | 'RepositoryPassword'
    | 'RepositoryUsername'
    | 'RepositoryGitCredentialID'
  >
) {
  if (!model.RepositoryAuthentication) {
    return undefined;
  }

  if (model.RepositoryGitCredentialID) {
    return { gitCredentialId: model.RepositoryGitCredentialID };
  }

  return {
    username: model.RepositoryUsername,
    password: model.RepositoryPassword,
  };
}

export function confirmEnableTLSVerify() {
  return confirm({
    title: '启用 TLS 验证？',
    message:
      '启用 TLS 证书验证，但未确保自签名证书的证书颁发机构（CA）配置正确，可能导致部署失败。',
  });
}
