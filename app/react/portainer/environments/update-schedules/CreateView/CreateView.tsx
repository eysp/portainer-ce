import { useMemo } from 'react';
import { Settings } from 'lucide-react';
import { Formik, Form as FormikForm } from 'formik';
import { useRouter } from '@uirouter/react';

import { notifySuccess } from '@/portainer/services/notifications';
import { withLimitToBE } from '@/react/hooks/useLimitToBE';
import { useEdgeGroups } from '@/react/edge/edge-groups/queries/useEdgeGroups';

import { PageHeader } from '@@/PageHeader';
import { Widget } from '@@/Widget';
import { LoadingButton } from '@@/buttons';
import { TextTip } from '@@/Tip/TextTip';
import { Link } from '@@/Link';

import { ScheduleType } from '../types';
import { useCreateMutation } from '../queries/create';
import { FormValues } from '../common/types';
import { validation } from '../common/validation';
import { ScheduleTypeSelector } from '../common/ScheduleTypeSelector';
import { useList } from '../queries/list';
import { NameField } from '../common/NameField';
import { EdgeGroupsField } from '../common/EdgeGroupsField';
import { BetaAlert } from '../common/BetaAlert';
import { defaultValue } from '../common/ScheduledTimeField';

export default withLimitToBE(CreateView);

function CreateView() {
  const initialValues = useMemo<FormValues>(
    () => ({
      name: '',
      groupIds: [],
      type: ScheduleType.Update,
      version: '',
      scheduledTime: defaultValue(),
    }),
    []
  );
  const edgeGroupsQuery = useEdgeGroups();
  const schedulesQuery = useList();

  const createMutation = useCreateMutation();
  const router = useRouter();

  if (!schedulesQuery.data) {
    return null;
  }

  const schedules = schedulesQuery.data;

  return (
    <>
      <PageHeader
        title="更新和回滚"
        breadcrumbs="边缘代理更新和回滚"
      />

      <BetaAlert
        className="ml-[15px] mb-2"
        message="测试版功能-目前仅限独立Linux和Nomad边缘设备。"
      />

      <div className="row">
        <div className="col-sm-12">
          <Widget>
            <Widget.Title title="更新和回滚调度器" icon={Settings} />
            <Widget.Body>
              <TextTip color="blue" className="mb-2">
                设备需要分配到边缘组，访问{' '}
                <Link to="edge.groups">边缘组</Link> 页面以分配环境并创建组。
              </TextTip>

              <Formik
                initialValues={initialValues}
                onSubmit={handleSubmit}
                validateOnMount
                validationSchema={() =>
                  validation(schedules, edgeGroupsQuery.data)
                }
              >
                {({ isValid, setFieldValue, values, handleBlur, errors }) => (
                  <FormikForm className="form-horizontal">
                    <NameField />
                    <EdgeGroupsField
                      onChange={(value) => setFieldValue('groupIds', value)}
                      value={values.groupIds}
                      onBlur={handleBlur}
                      error={errors.groupIds}
                    />

                    <TextTip color="blue">
                      您只能从任何代理版本升级到2.17或更高版本。您不能升级到低于2.17的代理版本。仅2.15.0+支持回滚到原始版本。
                    </TextTip>

                    <div className="mt-2">
                      <ScheduleTypeSelector />
                    </div>

                    <div className="form-group">
                      <div className="col-sm-12">
                        <LoadingButton
                          disabled={!isValid}
                          isLoading={createMutation.isLoading}
                          loadingText="正在创建..."
                        >
                          创建计划
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

  function handleSubmit(values: FormValues) {
    createMutation.mutate(values, {
      onSuccess() {
        notifySuccess('成功', '计划创建成功');
        router.stateService.go('^');
      },
    });
  }
}
