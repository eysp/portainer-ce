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
    title: '启用 TLS 验证',
    message:
      '启用 TLS 证书验证时，如果没有确保正确配置您的证书颁发机构（CA）以支持自签名证书，可能会导致部署失败。',
  });
}
