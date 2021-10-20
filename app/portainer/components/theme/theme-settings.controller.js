import { buildOption } from '@/portainer/components/box-selector';

export default class ThemeSettingsController {
  /* @ngInject */
  constructor($async, Authentication, ThemeManager, StateManager, UserService, Notifications) {
    this.$async = $async;
    this.Authentication = Authentication;
    this.ThemeManager = ThemeManager;
    this.StateManager = StateManager;
    this.UserService = UserService;
    this.Notifications = Notifications;

    this.setTheme = this.setTheme.bind(this);
  }

  /** Theme Settings Panel */
  async updateTheme() {
    try {
      await this.UserService.updateUserTheme(this.state.userId, this.state.userTheme);
      this.state.themeInProgress = false;
      this.Notifications.success('成功', '用户主题更新成功');
    } catch (err) {
      this.Notifications.error('失败', err, '无法更新用户主题');
    }
  }

  setTheme(theme) {
    this.ThemeManager.setTheme(theme);
    this.state.themeInProgress = true;
  }

  $onInit() {
    return this.$async(async () => {
      this.state = {
        userId: null,
        userTheme: '',
        initTheme: '',
        defaultTheme: 'light',
        themeInProgress: false,
      };

      this.state.availableThemes = [
        buildOption('light', 'fas fa-sun', 'Light Theme', 'Default color mode', 'light'),
        buildOption('dark', 'fas fa-moon', 'Dark Theme', 'Dark color mode', 'dark'),
        buildOption('highcontrast', 'fas fa-adjust', 'High Contrast', 'High contrast color mode', 'highcontrast'),
      ];

      this.state.availableTheme = {
        light: 'light',
        dark: 'dark',
        highContrast: 'highcontrast',
      };

      try {
        this.state.userId = await this.Authentication.getUserDetails().ID;
        const data = await this.UserService.user(this.state.userId);
        this.state.userTheme = data.UserTheme || this.state.defaultTheme;
        this.state.initTheme = this.state.userTheme;
      } catch (err) {
        this.Notifications.error('失败', err, '无法获取用户详细信息');
      }
    });
  }

  $onDestroy() {
    if (this.state.themeInProgress) {
      this.ThemeManager.setTheme(this.state.initTheme);
    }
  }
}
