import { HIDE_INTERNAL_AUTH } from '@/portainer/feature-flags/feature-ids';

import { buildOption } from '@/portainer/components/box-selector';

export default class OAuthProviderSelectorController {
  constructor() {
    this.options = [
      buildOption('microsoft', 'fab fa-microsoft', '微软', 'Microsoft OAuth provider', 'microsoft', HIDE_INTERNAL_AUTH),
      buildOption('google', 'fab fa-google', '谷歌', 'Google OAuth provider', 'google', HIDE_INTERNAL_AUTH),
      buildOption('github', 'fab fa-github', 'Github', 'Github OAuth provider', 'github', HIDE_INTERNAL_AUTH),
      buildOption('custom', 'fa fa-user-check', '自定义', '自定义OAuth提供程序', 'custom'),
    ];
  }
}
