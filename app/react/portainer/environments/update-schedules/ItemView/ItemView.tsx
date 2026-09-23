import { Settings } from 'lucide-react';
import { Formik, Form as FormikForm } from 'formik';
import { useCurrentStateAndParams, useRouter } from '@uirouter/react';
import { object, SchemaOf } from 'yup';

import { notifySuccess } from '@/portainer/services/notifications';
import { withLimitToBE } from '@/react/hooks/useLimitToBE';
import { useEdgeGroups } from '@/react/edge/edge-groups/queries/useEdgeGroups';
import { EdgeGroup } from '@/react/edge/edge-groups/types';

import { PageHeader } from '@@/PageHeader';
import { Widget } from '@@/Widget';
import { LoadingButton } from '@@/buttons';
import { TextTip } from '@@/Tip/TextTip';
import { InformationPanel } from '@@/InformationPanel';
import { Link } from '@@/Link';

import { useItem } from '../queries/useItem';
import { validation } from '../common/validation';
import { useUpdateMutation } from '../queries/useUpdateMutation';
import { useList } from '../queries/list';
import { NameField, nameValidation } from '../common/NameField';
import { EdgeGroupsField } from '../common/EdgeGroupsField';
import { EdgeUpdateSchedule } from '../types';
import { FormValues } from '../common/types';
import { ScheduleTypeSelector } from '../common/ScheduleTypeSelector';
import { BetaAlert } from '../common/BetaAlert';

export default withLimitToBE(ItemView);

function ItemView() {
  const {
    params: { id: idParam },
  } = useCurrentStateAndParams();

  const id = parseInt(idParam, 10);
  const edgeGroupsQuery = useEdgeGroups();

  if (!idParam || Number.isNaN(id)) {
    throw new Error('id is a required path param');
  }

  const updateMutation = useUpdateMutation();
  const router = useRouter();
  const itemQuery = useItem(id);
  const schedulesQuery = useList();

  if (!itemQuery.data || !schedulesQuery.data) {
    return null;
  }

  const item = itemQuery.data;
  const isScheduleActive = item.isActive;

  const schedules = schedulesQuery.data;

  const initialValuesActive: Partial<FormValues> = {
    name: item.name,
  };

  const initialValues: FormValues = {
    name: item.name,
    groupIds: item.edgeGroupIds,
    type: item.type,
    version: item.version,
    scheduledTime: item.scheduledTime,
  };

  const environmentsCount = Object.keys(
    item.environmentsPreviousVersions
  ).length;

  return (
    <>
      <PageHeader
        title="更新与回滚"
        breadcrumbs={[
          { label: 'Edge agent 更新与回滚', link: '^' },
          item.name,
        ]}
        reload
      />

      <BetaAlert
        className="mb-2 ml-[15px]"
        message="Beta 阶段功能 - 目前仅限于独立 Linux 边缘设备。"
      />

      <div className="row">
        <div className="col-sm-12">
          <Widget>
            <Widget.Title title="更新与回滚计划" icon={Settings} />
            <Widget.Body>
              <TextTip color="blue" className="mb-2">
                设备需要分配给一个 Edge 分组，请访问{' '}
                <Link
                  to="edge.groups"
                  data-cy="update-schedules-edge-groups-link"
                >
                  Edge 分组
                </Link>{' '}
                页面分配环境并创建分组。
                <br />
                你只能从任何 agent 版本升级到 2.17 或更高版本。不能升级到 2.17 之前的 agent 版本。回滚到原始版本的功能仅适用于 2.15.0 及更高版本。
              </TextTip>

              <Formik
                initialValues={
                  !isScheduleActive ? initialValues : initialValuesActive
                }
                onSubmit={(values) => {
                  updateMutation.mutate(
                    { id, values },
                    {
                      onSuccess() {
                        notifySuccess(
                          'Success',
                          '计划更新成功'
                        );
                        router.stateService.go('^');
                      },
                    }
                  );
                }}
                validateOnMount
                validationSchema={() =>
                  updateValidation(
                    item.id,
                    schedules,
                    edgeGroupsQuery.data,
                    isScheduleActive
                  )
                }
              >
                {({ isValid, setFieldValue, values, handleBlur, errors }) => (
                  <FormikForm className="form-horizontal">
                    <NameField />

                    <EdgeGroupsField
                      disabled={isScheduleActive}
                      onChange={(value) => setFieldValue('groupIds', value)}
                      value={
                        isScheduleActive
                          ? item.edgeGroupIds
                          : values.groupIds || []
                      }
                      onBlur={handleBlur}
                      error={errors.groupIds}
                    />

                    <div className="mt-2">
                      {isScheduleActive ? (
                        <InformationPanel>
                          <TextTip color="blue">
                            {environmentsCount} 个环境将在本地时间 {item.scheduledTime} 更新到 {item.version} 版本
                          </TextTip>
                        </InformationPanel>
                      ) : (
                        <ScheduleTypeSelector />
                      )}
                    </div>

                    <div className="form-group">
                      <div className="col-sm-12">
                        <LoadingButton
                          disabled={!isValid}
                          data-cy="update-schedule-button"
                          isLoading={updateMutation.isLoading}
                          loadingText="正在更新..."
                        >
                          更新计划
                        </LoadingButton>
                      </div>
                    </div>
                  </FormikForm>
                )}
              </Formik>
            </Widget.Body>
          </Widget>
        </div>
      </div>
    </>
  );
}

function updateValidation(
  itemId: EdgeUpdateSchedule['id'],
  schedules: EdgeUpdateSchedule[],
  edgeGroups: Array<EdgeGroup> | undefined,
  isScheduleActive: boolean
): SchemaOf<{ name: string } | FormValues> {
  return !isScheduleActive
    ? validation(schedules, edgeGroups, itemId)
    : object({ name: nameValidation(schedules, itemId) });
}
