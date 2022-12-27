import { object, string, array, number } from 'yup';

import { Team } from '@/react/portainer/users/teams/types';

export function validationSchema(teams: Team[]) {
  return object().shape({
    name: string()
      .required('此字段必填。')
      .test(
        'is-unique',
        '此团队已存在。',
        (name) => !!name && teams.every((team) => team.Name !== name)
      ),
    leaders: array().of(number()),
  });
}
