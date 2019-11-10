module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.bulkInsert(
      'Users',
      [
        {
          name: 'Jane Doe',
          email: 'janedoe@example.com',
          role: 'admin',
          password:
            '$2a$12$u.3/qLxhPxSCwh4sAGNABOPMeFFQob7ZGOvsw7u5Sv7MKyGZCox/e',
          active: true,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: 'Jon Doe',
          email: 'jondoe@example.com',
          role: 'user',
          password:
            '$2a$12$u.3/qLxhPxSCwh4sAGNABOPMeFFQob7ZGOvsw7u5Sv7MKyGZCox/e',
          active: true,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: 'Tom Doe',
          email: 'tomdoe@example.com',
          role: 'user',
          password:
            '$2a$12$u.3/qLxhPxSCwh4sAGNABOPMeFFQob7ZGOvsw7u5Sv7MKyGZCox/e',
          active: true,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ],
      {}
    ),

  down: (queryInterface, Sequelize) =>
    queryInterface.bulkDelete('Users', null, {})
};
