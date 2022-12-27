import _ from 'lodash-es';
import { confirmDestructiveAsync } from '@/portainer/services/modal.service/confirm';
import { EdgeTypes } from '@/portainer/environments/types';
import { getEnvironments } from '@/portainer/environments/environment.service';

export class EdgeGroupFormController {
  /* @ngInject */
  constructor($async, $scope) {
    this.$async = $async;
    this.$scope = $scope;

    this.endpoints = {
      state: {
        limit: '10',
        filter: '',
        pageNumber: 1,
        totalCount: 0,
      },
      value: null,
    };

    this.associateEndpoint = this.associateEndpoint.bind(this);
    this.dissociateEndpoint = this.dissociateEndpoint.bind(this);
    this.getDynamicEndpointsAsync = this.getDynamicEndpointsAsync.bind(this);
    this.getDynamicEndpoints = this.getDynamicEndpoints.bind(this);
    this.onChangeTags = this.onChangeTags.bind(this);

    $scope.$watch(
      () => this.model,
      () => {
        if (this.model.Dynamic) {
          this.getDynamicEndpoints();
        }
      },
      true
    );
  }

  onChangeTags(value) {
    return this.$scope.$evalAsync(() => {
      this.model.TagIds = value;
    });
  }

  associateEndpoint(endpoint) {
    if (!_.includes(this.model.Endpoints, endpoint.Id)) {
      this.model.Endpoints = [...this.model.Endpoints, endpoint.Id];
    }
  }

  dissociateEndpoint(endpoint) {
    return this.$async(async () => {
      const confirmed = await confirmDestructiveAsync({
        title: '确认操作',
        message: '从这个组中删除环境将删除其相应的边缘堆栈',
        buttons: {
          cancel: {
            label: '取消',
            className: 'btn-default',
          },
          confirm: {
            label: '确认',
            className: 'btn-primary',
          },
        },
      });

      if (!confirmed) {
        return;
      }

      this.model.Endpoints = _.filter(this.model.Endpoints, (id) => id !== endpoint.Id);
    });
  }

  getDynamicEndpoints() {
    return this.$async(this.getDynamicEndpointsAsync);
  }

  async getDynamicEndpointsAsync() {
    const { pageNumber, limit, search } = this.endpoints.state;
    const start = (pageNumber - 1) * limit + 1;
    const query = { search, types: EdgeTypes, tagIds: this.model.TagIds, tagsPartialMatch: this.model.PartialMatch };

    const response = await getEnvironments({ start, limit, query });

    const totalCount = parseInt(response.totalCount, 10);
    this.endpoints.value = response.value;
    this.endpoints.state.totalCount = totalCount;
  }
}
