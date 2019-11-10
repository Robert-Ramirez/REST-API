module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.bulkInsert(
      'Tasks',
      [
        {
          name: 'School',
          duration: 2,
          description: 'Testing.',
          active: true,
          createdAt: new Date(),
          updatedAt: new Date(),
          userId: 1
        },
        {
          name: 'Study',
          duration: 4,
          description: 'Testing.',
          active: true,
          createdAt: new Date(),
          updatedAt: new Date(),
          userId: 1
        }
      ],
      {}
    ),

  down: (queryInterface, Sequelize) =>
    queryInterface.bulkDelete('Tasks', null, {})
};
