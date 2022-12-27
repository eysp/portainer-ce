export class NodeSelectorController {
  /* @ngInject */
  constructor(AgentService, Notifications) {
    Object.assign(this, { AgentService, Notifications });
  }

  async $onInit() {
    try {
      const agents = await this.AgentService.agents();
      this.agents = agents;
      if (!this.model) {
        this.model = agents[0].NodeName;
      }
    } catch (err) {
      this.Notifications.error('失败', err, '无法加载代理');
    }
  }
}
