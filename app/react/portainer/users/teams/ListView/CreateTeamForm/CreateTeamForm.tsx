import { Formik, Field, Form } from 'formik';
import { useMutation, useQueryClient } from 'react-query';
import { useReducer } from 'react';

import { Icon } from '@/react/components/Icon';
import { User } from '@/portainer/users/types';
import { notifySuccess } from '@/portainer/services/notifications';

import { FormControl } from '@@/form-components/FormControl';
import { Widget } from '@@/Widget';
import { Input } from '@@/form-components/Input';
import { UsersSelector } from '@@/UsersSelector';
import { LoadingButton } from '@@/buttons/LoadingButton';

import { createTeam } from '../../teams.service';
import { Team } from '../../types';

import { FormValues } from './types';
import { validationSchema } from './CreateTeamForm.validation';

interface Props {
  users: User[];
  teams: Team[];
}

export function CreateTeamForm({ users, teams }: Props) {
  const addTeamMutation = useAddTeamMutation();
  const [formKey, incFormKey] = useReducer((state: number) => state + 1, 0);

  const initialValues = {
    name: '',
    leaders: [],
  };

  return (
    <div className="row">
      <div className="col-lg-12 col-md-12 col-xs-12">
        <Widget>
          <Widget.Title
            icon="plus"
            title="添加新团队"
            featherIcon
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
                      label="选择团队领导"
                      tooltip="您可以为此团队指派一个或多个领导者。团队领导者可以管理他们的团队用户和资源。"
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
                        placeholder="选择一个或多个团队领导"
                      />
                    </FormControl>
                  )}

                  <div className="form-group">
                    <div className="col-sm-12">
                      <LoadingButton
                        disabled={!isValid}
                        data-cy="team-createTeamButton"
                        isLoading={isSubmitting || addTeamMutation.isLoading}
                        loadingText="创建团队中..."
                      >
                        <Icon icon="plus" feather size="md" />
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
        notifySuccess('团队已成功添加', '');
      },
    });
  }
}

export function useAddTeamMutation() {
  const queryClient = useQueryClient();

  return useMutation(
    (values: FormValues) => createTeam(values.name, values.leaders),
    {
      meta: {
        error: {
          title: 'Failure',
          message: '未能创建团队',
        },
      },
      onSuccess() {
        return queryClient.invalidateQueries(['teams']);
      },
    }
  );
}
