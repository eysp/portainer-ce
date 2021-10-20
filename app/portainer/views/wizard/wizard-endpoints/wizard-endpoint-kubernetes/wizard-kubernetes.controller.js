import { PortainerEndpointCreationTypes } from 'Portainer/models/endpoint/models';
//import { getAgentShortVersion } from 'Portainer/views/endpoints/helpers';
import { buildOption } from '@/portainer/components/box-selector';
import { getAgentShortVersion } from 'Portainer/views/endpoints/helpers';

export default class WizardKubernetesController {
  /* @ngInject */
  constructor($async, EndpointService, StateManager, Notifications, $filter, clipboard, NameValidator) {
    this.$async = $async;
    this.EndpointService = EndpointService;
    this.StateManager = StateManager;
    this.Notifications = Notifications;
    this.$filter = $filter;
    this.clipboard = clipboard;
    this.NameValidator = NameValidator;
  }

  addKubernetesAgent() {
    return this.$async(async () => {
      const name = this.state.formValues.name;
      const groupId = 1;
      const tagIds = [];
      const url = this.$filter('stripprotocol')(this.state.formValues.url);
      const publicUrl = url.split(':')[0];
      const creationType = PortainerEndpointCreationTypes.AgentEnvironment;
      const tls = true;
      const tlsSkipVerify = true;
      const tlsSkipClientVerify = true;
      const tlsCaFile = null;
      const tlsCertFile = null;
      const tlsKeyFile = null;

      // Check name is duplicated or not
      let nameUsed = await this.NameValidator.validateEnvironmentName(name);
      if (nameUsed) {
        this.Notifications.error('失败', true, '此名称已被使用，请尝试另一个');
        return;
      }
      await this.addRemoteEndpoint(name, creationType, url, publicUrl, groupId, tagIds, tls, tlsSkipVerify, tlsSkipClientVerify, tlsCaFile, tlsCertFile, tlsKeyFile);
    });
  }

  async addRemoteEndpoint(name, creationType, url, publicURL, groupId, tagIds, tls, tlsSkipVerify, tlsSkipClientVerify, tlsCaFile, tlsCertFile, tlsKeyFile) {
    this.state.actionInProgress = true;
    try {
      await this.EndpointService.createRemoteEndpoint(
        name,
        creationType,
        url,
        publicURL,
        groupId,
        tagIds,
        tls,
        tlsSkipVerify,
        tlsSkipClientVerify,
        tlsCaFile,
        tlsCertFile,
        tlsKeyFile
      );
      this.Notifications.success('环境连接', name);
      this.clearForm();
      this.onUpdate();
      this.onAnalytics('kubernetes-agent');
    } catch (err) {
      this.Notifications.error('失败', err, 'U无法连接您的环境');
    } finally {
      this.state.actionInProgress = false;
    }
  }

  copyLoadBalancer() {
    this.clipboard.copyText(this.command.loadBalancer);
    $('#loadBalancerNotification').show().fadeOut(2500);
  }

  copyNodePort() {
    this.clipboard.copyText(this.command.nodePort);
    $('#nodePortNotification').show().fadeOut(2500);
  }

  clearForm() {
    this.state.formValues = {
      name: '',
      url: '',
    };
  }

  $onInit() {
    return this.$async(async () => {
      this.state = {
        endpointType: 'agent',
        actionInProgress: false,
        formValues: {
          name: '',
          url: '',
        },
        availableOptions: [buildOption('Agent', 'fa fa-bolt', 'Agent', '', 'agent')],
      };

      const agentVersion = this.StateManager.getState().application.version;
      const agentShortVersion = getAgentShortVersion(agentVersion);

      this.command = {
        loadBalancer: `curl -L https://downloads.portainer.io/portainer-agent-ce${agentShortVersion}-k8s-lb.yaml -o portainer-agent-k8s.yaml; kubectl apply -f portainer-agent-k8s.yaml `,
        nodePort: `curl -L https://downloads.portainer.io/portainer-agent-ce${agentShortVersion}-k8s-nodeport.yaml -o portainer-agent-k8s.yaml; kubectl apply -f portainer-agent-k8s.yaml `,
      };
    });
  }
}
