import { User, Clock, Info } from 'lucide-react';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { Pod } from 'kubernetes-types/core/v1';
import { useCurrentStateAndParams } from '@uirouter/react';

import { Authorized } from '@/react/hooks/useUser';
import { notifyError, notifySuccess } from '@/portainer/services/notifications';
import { usePublicSettings } from '@/react/portainer/settings/queries';
import { GlobalDeploymentOptions } from '@/react/portainer/settings/types';

import { DetailsTable } from '@@/DetailsTable';
import { Link } from '@@/Link';
import { LoadingButton } from '@@/buttons';
import { WidgetBody, Widget } from '@@/Widget';
import { InlineLoader } from '@@/InlineLoader';
import { Icon } from '@@/Icon';
import { Note } from '@@/Note';
import { ExternalBadge } from '@@/Badge/ExternalBadge';
import { SystemBadge } from '@@/Badge/SystemBadge';

import {
  appStackNameLabel,
  appKindToDeploymentTypeMap,
  appOwnerLabel,
  appDeployMethodLabel,
  appNoteAnnotation,
} from '../constants';
import {
  applicationIsKind,
  bytesToReadableFormat,
  getResourceRequests,
  getRunningPods,
  getTotalPods,
  isExternalApplication,
} from '../utils';
import { Application, ApplicationPatch } from '../types';
import { useNamespaceQuery } from '../../namespaces/queries/useNamespaceQuery';
import { useApplication } from '../queries/useApplication';
import { usePatchApplicationMutation } from '../queries/usePatchApplicationMutation';

export function ApplicationSummaryWidget() {
  const stateAndParams = useCurrentStateAndParams();
  const {
    params: {
      namespace,
      name,
      'resource-type': resourceType,
      endpointId: environmentId,
    },
  } = stateAndParams;
  const { data: application, ...applicationQuery } = useApplication(
    environmentId,
    namespace,
    name,
    resourceType
  );
  const namespaceData = useNamespaceQuery(environmentId, namespace);
  const isSystemNamespace = namespaceData.data?.IsSystem;

  const externalApplication = application && isExternalApplication(application);
  const applicationRequests = application && getResourceRequests(application);
  const applicationOwner = application?.metadata?.labels?.[appOwnerLabel];
  const applicationDeployMethod = getApplicationDeployMethod(application);
  const applicationNote =
    application?.metadata?.annotations?.[appNoteAnnotation];

  const [applicationNoteFormValues, setApplicationNoteFormValues] =
    useState('');

  useEffect(() => {
    setApplicationNoteFormValues(applicationNote || '');
  }, [applicationNote]);

  const globalDeploymentOptionsQuery =
    usePublicSettings<GlobalDeploymentOptions>({
      select: (settings) => settings.GlobalDeploymentOptions,
    });

  const failedCreateCondition = application?.status?.conditions?.find(
    (condition) => condition.reason === 'FailedCreate'
  );
  const patchApplicationMutation = usePatchApplicationMutation(
    environmentId,
    namespace,
    name
  );

  return (
    <div className="row">
      <div className="col-sm-12">
        <Widget>
          <WidgetBody>
            {applicationQuery.isLoading && (
              <InlineLoader>正在加载应用程序...</InlineLoader>
            )}
            {application && (
              <>
                {failedCreateCondition && (
                  <div
                    className="alert alert-danger mb-2 flex items-start gap-1"
                    data-cy="k8sAppDetail-failedCreateMessage"
                  >
                    <div className="mt-0.5">
                      <Icon
                        icon={Info}
                        className="mr-1 shrink-0"
                        mode="danger"
                      />
                    </div>
                    <div>
                      <div className="font-semibold">
                        创建应用程序失败
                      </div>
                      {failedCreateCondition.message}
                    </div>
                  </div>
                )}
                <DetailsTable dataCy="k8sAppDetail-table">
                  <tr>
                    <td>名称</td>
                    <td>
                      <div
                        className="flex items-center gap-x-2"
                        data-cy="k8sAppDetail-appName"
                      >
                        {name}
                        {externalApplication && !isSystemNamespace && (
                          <ExternalBadge />
                        )}
                      </div>
                    </td>
                  </tr>
                  {globalDeploymentOptionsQuery.data &&
                    !globalDeploymentOptionsQuery.data
                      .hideStacksFunctionality && (
                      <tr>
                        <td>堆栈</td>
                        <td data-cy="k8sAppDetail-stackName">
                          {application?.metadata?.labels?.[appStackNameLabel] ||
                            '-'}
                        </td>
                      </tr>
                    )}
                  <tr>
                    <td>命名空间</td>
                    <td>
                      <div
                        className="flex items-center gap-x-2"
                        data-cy="k8sAppDetail-resourcePoolName"
                      >
                        <Link
                          to="kubernetes.resourcePools.resourcePool"
                          data-cy="k8sAppDetail-namespaceLink"
                          params={{ id: namespace }}
                        >
                          {namespace}
                        </Link>
                        {isSystemNamespace && <SystemBadge />}
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td>应用类型</td>
                    <td data-cy="k8sAppDetail-appType">
                      {application?.kind || '-'}
                    </td>
                  </tr>
                  {application?.kind && (
                    <tr>
                      <td>状态</td>
                      {applicationIsKind<Pod>('Pod', application) && (
                        <td data-cy="k8sAppDetail-appType">
                          {application?.status?.phase}
                        </td>
                      )}
                      {!applicationIsKind<Pod>('Pod', application) && (
                        <td data-cy="k8sAppDetail-appType">
                          {appKindToDeploymentTypeMap[application.kind]}
                          <code className="ml-1">
                            {getRunningPods(application)}
                          </code>{' '}
                          / <code>{getTotalPods(application)}</code>
                        </td>
                      )}
                    </tr>
                  )}
                  {(!!applicationRequests?.cpu ||
                    !!applicationRequests?.memoryBytes) && (
                    <tr>
                      <td>
                        资源预留
                        {!applicationIsKind<Pod>('Pod', application) && (
                          <div className="text-muted small">per instance</div>
                        )}
                      </td>
                      <td>
                        {!!applicationRequests?.cpu && (
                          <div data-cy="k8sAppDetail-cpuReservation">
                            CPU {applicationRequests.cpu}
                          </div>
                        )}
                        {!!applicationRequests?.memoryBytes && (
                          <div data-cy="k8sAppDetail-memoryReservation">
                            内存{' '}
                            {bytesToReadableFormat(
                              applicationRequests.memoryBytes
                            )}
                          </div>
                        )}
                      </td>
                    </tr>
                  )}
                  <tr>
                    <td>创建</td>
                    <td>
                      <div className="flex flex-wrap items-center gap-3">
                        {applicationOwner && (
                          <span
                            className="flex items-center gap-1"
                            data-cy="k8sAppDetail-owner"
                          >
                            <User />
                            {applicationOwner}
                          </span>
                        )}
                        <span
                          className="flex items-center gap-1"
                          data-cy="k8sAppDetail-creationDate"
                        >
                          <Clock />
                          {moment(
                            application?.metadata?.creationTimestamp
                          ).format('YYYY-MM-DD HH:mm:ss')}
                        </span>
                        {(!externalApplication || isSystemNamespace) && (
                          <span
                            className="flex items-center gap-1"
                            data-cy="k8sAppDetail-creationMethod"
                          >
                            <Clock />
                            部署方式： {applicationDeployMethod}
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td colSpan={2}>
                      <form className="form-horizontal">
                        <Note
                          value={applicationNoteFormValues}
                          onChange={setApplicationNoteFormValues}
                          defaultIsOpen
                          isExpandable
                        />
                        <Authorized authorizations="K8sApplicationDetailsW">
                          <div className="form-group">
                            <div className="col-sm-12">
                              <LoadingButton
                                color="primary"
                                size="small"
                                className="!ml-0"
                                type="button"
                                onClick={() => patchApplicationNote()}
                                disabled={
                                  // disable if there is no change to the note, or it's updating
                                  applicationNoteFormValues ===
                                    (applicationNote || '') ||
                                  patchApplicationMutation.isLoading
                                }
                                data-cy="k8sAppDetail-saveNoteButton"
                                isLoading={patchApplicationMutation.isLoading}
                                loadingText={
                                  applicationNote ? '正在更新' : '正在保存'
                                }
                              >
                                {applicationNote ? '更新' : '保存'} 备注
                              </LoadingButton>
                            </div>
                          </div>
                        </Authorized>
                      </form>
                    </td>
                  </tr>
                </DetailsTable>
              </>
            )}
          </WidgetBody>
        </Widget>
      </div>
    </div>
  );

  async function patchApplicationNote() {
    const patch: ApplicationPatch = [
      {
        op: 'replace',
        path: `/metadata/annotations/${appNoteAnnotation}`,
        value: applicationNoteFormValues,
      },
    ];
    if (application?.kind) {
      try {
        await patchApplicationMutation.mutateAsync({
          appKind: application.kind,
          patch,
        });
        notifySuccess('Success', 'Application successfully updated');
      } catch (error) {
        notifyError(
          `Failed to ${applicationNote ? 'update' : 'save'} note`,
          error as Error
        );
      }
    }
  }
}

function getApplicationDeployMethod(application?: Application) {
  if (!application?.metadata?.labels?.[appDeployMethodLabel])
    return 'application form';
  if (application?.metadata?.labels?.[appDeployMethodLabel] === 'content') {
    return 'manifest';
  }
  return application?.metadata?.labels?.[appDeployMethodLabel];
}
