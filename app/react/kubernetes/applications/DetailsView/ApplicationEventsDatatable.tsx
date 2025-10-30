import { useCurrentStateAndParams } from '@uirouter/react';
import { useMemo } from 'react';
import { compact } from 'lodash';

import { createStore } from '@/react/kubernetes/datatables/default-kube-datatable-store';
import { EnvironmentId } from '@/react/portainer/environments/types';

import { useTableState } from '@@/datatables/useTableState';

import { EventsDatatable } from '../../components/EventsDatatable';
import { useEvents } from '../../queries/useEvents';
import { AppKind } from '../types';
import { useApplication } from '../queries/useApplication';
import { useApplicationServices } from '../queries/useApplicationServices';
import { useApplicationPods } from '../queries/useApplicationPods';

const storageKey = 'k8sAppEventsDatatable';
const settingsStore = createStore(storageKey, { id: 'Date', desc: true });

export function ApplicationEventsDatatable() {
  const tableState = useTableState(settingsStore, storageKey);
  const {
    params: {
      namespace,
      name,
      'resource-type': appKind,
      endpointId: environmentId,
    },
  } = useCurrentStateAndParams();

  const { relatedEvents, isInitialLoading } = useApplicationEvents(
    environmentId,
    namespace,
    name,
    appKind,
    {
      autoRefreshRate: tableState.autoRefreshRate,
    }
  );

  return (
    <EventsDatatable
      dataset={relatedEvents}
      tableState={tableState}
      isLoading={isInitialLoading}
      data-cy="k8sAppDetail-eventsTable"
      noWidget
    />
  );
}

export function useApplicationEvents(
  environmentId: EnvironmentId,
  namespace: string,
  name: string,
  appKind?: AppKind,
  options?: { autoRefreshRate?: number; yaml?: boolean }
) {
  const { data: application, ...applicationQuery } = useApplication(
    environmentId,
    namespace,
    name,
    appKind
  );
  const servicesQuery = useApplicationServices(
    environmentId,
    namespace,
    name,
    application
  );
  const podsQuery = useApplicationPods(
    environmentId,
    namespace,
    name,
    application
  );

  // related events are events that have the application id, or the id of a service or pod from the application
  const relatedUids = useMemo(() => {
    const serviceIds = compact(
      servicesQuery.data?.map((service) => service?.metadata?.uid)
    );
    const podIds = compact(podsQuery.data?.map((pod) => pod?.metadata?.uid));
    return [application?.metadata?.uid, ...serviceIds, ...podIds];
  }, [application?.metadata?.uid, podsQuery.data, servicesQuery.data]);

  const relatedUidsSet = useMemo(() => new Set(relatedUids), [relatedUids]);
  const { data: events, ...eventsQuery } = useEvents(environmentId, {
    namespace,
    queryOptions: {
      autoRefreshRate: options?.autoRefreshRate
        ? options.autoRefreshRate * 1000
        : undefined,
      select: (data) =>
        data.filter((event) => relatedUidsSet.has(event.involvedObject.uid)),
    },
  });

  const isInitialLoading =
    applicationQuery.isInitialLoading ||
    servicesQuery.isInitialLoading ||
    podsQuery.isInitialLoading ||
    eventsQuery.isInitialLoading;

  return { relatedEvents: events || [], isInitialLoading };
}
