'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Users', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      email: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false
      },
      role: {
        type: Sequelize.ENUM,
        values: ['user', 'admin'],
        defaultValue: 'user'
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false
      },
      passwordChangedAt: {
        type: Sequelize.DATE
      },
      passwordResetToken: {
        type: Sequelize.STRING
      },
      passwordResetExpires: {
        type: Sequelize.DATE
      },
      active: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Users');
  }
};
