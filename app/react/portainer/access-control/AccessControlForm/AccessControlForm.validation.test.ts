import { ResourceControlOwnership } from '../types';

import { validationSchema } from './AccessControlForm.validation';

test('when ownership not restricted, should be valid', async () => {
  const schema = validationSchema(true);
  [
    ResourceControlOwnership.ADMINISTRATORS,
    ResourceControlOwnership.PRIVATE,
    ResourceControlOwnership.PUBLIC,
  ].forEach(async (ownership) => {
    const object = { ownership };

    await expect(
      schema.validate(object, { strict: true })
    ).resolves.toStrictEqual(object);
  });
});

test('当所有权受到限制并且没有团队或用户时，应该无效', async () => {
  [true, false].forEach(async (isAdmin) => {
    const schema = validationSchema(isAdmin);

    await expect(
      schema.validate(
        {
          ownership: ResourceControlOwnership.RESTRICTED,
          authorizedTeams: [],
          authorizedUsers: [],
        },
        { strict: true }
      )
    ).rejects.toThrowErrorMatchingSnapshot();
  });
});

test('当所有权受到限制并且用户是管理员时，应该拥有团队或用户', async () => {
  const schema = validationSchema(true);
  const teams = {
    ownership: ResourceControlOwnership.RESTRICTED,
    authorizedTeams: [1],
    authorizedUsers: [],
  };

  await expect(schema.validate(teams, { strict: true })).resolves.toStrictEqual(
    teams
  );

  const users = {
    ownership: ResourceControlOwnership.RESTRICTED,
    authorizedTeams: [],
    authorizedUsers: [1],
  };

  await expect(schema.validate(users, { strict: true })).resolves.toStrictEqual(
    users
  );

  const both = {
    ownership: ResourceControlOwnership.RESTRICTED,
    authorizedTeams: [1],
    authorizedUsers: [2],
  };

  await expect(schema.validate(both, { strict: true })).resolves.toStrictEqual(
    both
  );
});

test('当所有权受到限制时，用户不是团队的管理员，应该有效', async () => {
  const schema = validationSchema(false);

  const object = {
    ownership: ResourceControlOwnership.RESTRICTED,
    authorizedTeams: [1],
    authorizedUsers: [],
  };

  await expect(
    schema.validate(object, { strict: true })
  ).resolves.toStrictEqual(object);
});
