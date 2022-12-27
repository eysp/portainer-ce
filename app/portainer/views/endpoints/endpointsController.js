import { map } from 'lodash';
import EndpointHelper from '@/portainer/helpers/endpointHelper';
import { getEnvironments } from '@/portainer/environments/environment.service';

export class EndpointsController {
  /* @ngInject */
  constructor($state, $async, EndpointService, GroupService, ModalService, Notifications, EndpointProvider, StateManager) {
    Object.assign(this, {
      $state,
      $async,
      EndpointService,
      GroupService,
      ModalService,
      Notifications,
      EndpointProvider,
      StateManager,
    });

    this.state = {
      loadingMessage: '',
    };

    this.setLoadingMessage = this.setLoadingMessage.bind(this);
    this.getPaginatedEndpoints = this.getPaginatedEndpoints.bind(this);
    this.removeAction = this.removeAction.bind(this);
  }

  setLoadingMessage(message) {
    this.state.loadingMessage = message;
  }

  removeAction(endpoints) {
    this.ModalService.confirmDeletion('这个动作将删除与您的环境相关的所有配置。继续吗？', (confirmed) => {
      if (!confirmed) {
        return;
      }
      return this.$async(async () => {
        try {
          await Promise.all(endpoints.map(({ Id }) => this.EndpointService.deleteEndpoint(Id)));
          this.Notifications.success('Environments successfully removed', map(endpoints, 'Name').join(', '));
        } catch (err) {
          this.Notifications.error('失败', err, 'Unable to remove environment');
        }

        const id = this.EndpointProvider.endpointID();
        // If the current endpoint was deleted, then clean endpoint store
        if (endpoints.some((e) => e.Id === id)) {
          this.StateManager.cleanEndpoint();
          // trigger sidebar rerender
          this.applicationState.endpoint = {};
        }

        this.$state.reload();
      });
    });
  }

  getPaginatedEndpoints(start, limit, search) {
    return this.$async(async () => {
      try {
        const [{ value: endpoints, totalCount }, groups] = await Promise.all([
          getEnvironments({ start, limit, query: { search, excludeSnapshots: true } }),
          this.GroupService.groups(),
        ]);
        EndpointHelper.mapGroupNameToEndpoint(endpoints, groups);
        return { endpoints, totalCount };
      } catch (err) {
        this.Notifications.error('失败', err, 'Unable to retrieve environment information');
      }
    });
  }
}
