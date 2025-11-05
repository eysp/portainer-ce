import { Formik, Field, Form } from 'formik';
import { useReducer } from 'react';
import { Plus } from 'lucide-react';

import { User } from '@/portainer/users/types';
import { notifySuccess } from '@/portainer/services/notifications';
import { usePublicSettings } from '@/react/portainer/settings/queries';

import { FormControl } from '@@/form-components/FormControl';
import { Widget } from '@@/Widget';
import { Input } from '@@/form-components/Input';
import { UsersSelector } from '@@/UsersSelector';
import { LoadingButton } from '@@/buttons/LoadingButton';
import { TextTip } from '@@/Tip/TextTip';

import { Team } from '../../types';
import { useAddTeamMutation } from '../../queries/useAddTeamMutation';

import { FormValues } from './types';
import { validationSchema } from './CreateTeamForm.validation';

interface Props {
  users: User[];
  teams: Team[];
}

export function CreateTeamForm({ users, teams }: Props) {
  const addTeamMutation = useAddTeamMutation();
  const [formKey, incFormKey] = useReducer((state: number) => state + 1, 0);
  const teamSyncQuery = usePublicSettings<boolean>({
    select: (settings) => settings.TeamSync,
  });

  const initialValues = {
    name: '',
    leaders: [],
  };

  return (
    <div className="row">
      <div className="col-lg-12 col-md-12 col-xs-12">
        <Widget>
          <Widget.Title
            icon={Plus}
            title="添加新团队"
            className="vertical-center"
          />
          <Widget.Body>
            <Formik
              initialValues={initialValues}
              validationSchema={() => validationSchema(teams)}
              onSubmit={handleAddTeamClick}
              validateOnMount
              key={formKey}
            >
              {({
                values,
                errors,
                handleSubmit,
                setFieldValue,
                isSubmitting,
                isValid,
              }) => (
                <Form
                  className="form-horizontal"
                  onSubmit={handleSubmit}
                  noValidate
                >
                  <FormControl
                    inputId="team_name"
                    label="名称"
                    errors={errors.name}
                    required
                  >
                    <Field
                      as={Input}
                      name="name"
                      id="team_name"
                      required
                      placeholder="例如 development"
                      data-cy="team-teamNameInput"
                    />
                  </FormControl>

                  {users.length > 0 && (
                    <FormControl
                      inputId="users-input"
                      label="选择团队负责人"
                      tooltip="您可以为该团队分配一个或多个负责人。团队负责人可以管理其团队的用户和资源。"
                      errors={errors.leaders}
                    >
                      <UsersSelector
                        value={values.leaders}
                        onChange={(leaders) =>
                          setFieldValue('leaders', leaders)
                        }
                        users={users}
                        dataCy="team-teamLeaderSelect"
                        inputId="users-input"
                        placeholder="选择一个或多个团队负责人"
                        disabled={teamSyncQuery.data}
                      />
                    </FormControl>
                  )}

                  {teamSyncQuery.data && (
                    <div className="form-group">
                      <div className="col-sm-12">
                        <TextTip color="orange">
                          由于当前启用了外部身份验证和团队同步，团队负责人功能已被禁用。
                        </TextTip>
                      </div>
                    </div>
                  )}

                  <div className="form-group">
                    <div className="col-sm-12">
                      <LoadingButton
                        disabled={!isValid}
                        data-cy="team-createTeamButton"
                        isLoading={isSubmitting || addTeamMutation.isLoading}
                        loadingText="正在创建团队..."
                        icon={Plus}
                        className="!ml-0"
                      >
                        创建团队
                      </LoadingButton>
                    </div>
                  </div>
                </Form>
              )}
            </Formik>
          </Widget.Body>
        </Widget>
      </div>
    </div>
  );

  async function handleAddTeamClick(values: FormValues) {
    addTeamMutation.mutate(values, {
      onSuccess() {
        incFormKey();
        notifySuccess('团队添加成功', '');
      },
    });
  }
}
