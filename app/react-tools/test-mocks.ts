import _ from 'lodash';
import { QueryObserverResult } from '@tanstack/react-query';

import { Team } from '@/react/portainer/users/teams/types';
import { Role, User, UserId } from '@/portainer/users/types';
import {
  ContainerEngine,
  Environment,
} from '@/react/portainer/environments/types';

export function createMockUsers(
  count: number,
  roles: Role | Role[] | ((id: UserId) => Role)
): User[] {
  return _.range(1, count + 1).map((value) => ({
    Id: value,
    Username: `user${value}`,
    Role: getRoles(roles, value),
    RoleName: '',
    AuthenticationMethod: '',
    Checked: false,
    EndpointAuthorizations: {},
    PortainerAuthorizations: {},
    UseCache: false,
    ThemeSettings: {
      color: 'auto',
    },
  }));
}

function getRoles(
  roles: Role | Role[] | ((id: UserId) => Role),
  id: UserId
): Role {
  if (typeof roles === 'function') {
    return roles(id);
  }

  if (typeof roles === 'number') {
    return roles;
  }

  // Roles is an array
  if (roles.length === 0) {
    throw new Error('No roles provided');
  }

  // The number of roles is not necessarily the same length as the number of users
  // so we need to distribute the roles evenly and consistently
  return roles[(id - 1) % roles.length];
}

export function createMockTeams(count: number): Team[] {
  return _.range(1, count + 1).map((value) => ({
    Id: value,
    Name: `team${value}`,
  }));
}

export function createMockSubscriptions(count: number) {
  const subscriptions = _.range(1, count + 1).map((x) => ({
    id: `/subscriptions/subscription-${x}`,
    subscriptionId: `subscription-${x}`,
  }));

  return { value: subscriptions };
}

export function createMockResourceGroups(subscription: string, count: number) {
  const resourceGroups = _.range(1, count + 1).map((x) => ({
    id: `/subscriptions/${subscription}/resourceGroups/resourceGroup-${x}`,
    name: `resourcegroup-${x}`,
  }));

  return { value: resourceGroups };
}

export function createMockEnvironment(): Environment {
  return {
    TagIds: [],
    GroupId: 1,
    Type: 1,
    ContainerEngine: ContainerEngine.Docker,
    Name: 'environment',
    Status: 1,
    URL: 'url',
    Snapshots: [],
    Kubernetes: {
      Flags: {
        IsServerMetricsDetected: true,
        IsServerIngressClassDetected: true,
        IsServerStorageDetected: true,
      },
      Snapshots: [],
      Configuration: {
        IngressClasses: [],
        IngressAvailabilityPerNamespace: false,
        AllowNoneIngressClass: false,
      },
    },
    UserAccessPolicies: {},
    TeamAccessPolicies: {},
    ComposeSyntaxMaxVersion: '0',
    EdgeKey: '',
    EnableGPUManagement: false,
    Id: 3,
    UserTrusted: false,
    Edge: {
      AsyncMode: false,
      PingInterval: 0,
      CommandInterval: 0,
      SnapshotInterval: 0,
    },
    SecuritySettings: {
      allowBindMountsForRegularUsers: false,
      allowPrivilegedModeForRegularUsers: false,
      allowContainerCapabilitiesForRegularUsers: false,
      allowDeviceMappingForRegularUsers: false,
      allowHostNamespaceForRegularUsers: false,
      allowStackManagementForRegularUsers: false,
      allowSysctlSettingForRegularUsers: false,
      allowVolumeBrowserForRegularUsers: false,
      enableHostManagementFeatures: false,
    },
    DeploymentOptions: {
      overrideGlobalOptions: false,
      hideAddWithForm: true,
      hideWebEditor: false,
      hideFileUpload: false,
    },
    Gpus: [],
    Agent: { Version: '1.0.0' },
    EnableImageNotification: false,
    ChangeWindow: {
      Enabled: false,
      EndTime: '',
      StartTime: '',
    },
    StatusMessage: {
      detail: '',
      summary: '',
    },
  };
}

export function createMockQueryResult<TData, TError = unknown>(
  data: TData,
  overrides?: Partial<QueryObserverResult<TData, TError>>
) {
  const defaultResult = {
    data,
    dataUpdatedAt: 0,
    error: null,
    errorUpdatedAt: 0,
    failureCount: 0,
    errorUpdateCount: 0,
    failureReason: null,
    isError: false,
    isFetched: true,
    isFetchedAfterMount: true,
    isFetching: false,
    isInitialLoading: false,
    isLoading: false,
    isLoadingError: false,
    isPaused: false,
    isPlaceholderData: false,
    isPreviousData: false,
    isRefetchError: false,
    isRefetching: false,
    isStale: false,
    isSuccess: true,
    refetch: async () => defaultResult,
    remove: () => {},
    status: 'success',
    fetchStatus: 'idle',
  };

  return { ...defaultResult, ...overrides };
}
