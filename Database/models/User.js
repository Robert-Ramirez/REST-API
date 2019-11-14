const crypto = require('crypto');
const bcrypt = require('bcryptjs');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
      },
      role: {
        type: DataTypes.ENUM,
        values: ['user', 'admin'],
        defaultValue: 'user'
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false
      },
      passwordChangedAt: {
        type: DataTypes.DATE
      },
      passwordResetToken: {
        type: DataTypes.STRING
      },
      passwordResetExpires: {
        type: DataTypes.DATE
      },
      active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
      }
    },
    {
      hooks: {
        beforeCreate: async function(user) {
          user.password = await bcrypt.hash(user.password, 12);
          user.passwordChangedAt = Date.now() - 1000;
        },
        beforeUpdate: async function(user) {
          user.password = await bcrypt.hash(user.password, 12);
          user.passwordChangedAt = Date.now() - 1000;
        }
      }
    }
  );

  User.prototype.correctPassword = async function(
    candidatePassword,
    userPassword
  ) {
    return await bcrypt.compare(candidatePassword, userPassword);
  };

  User.prototype.changedPasswordAfter = function(JWTTimestamp) {
    if (this.passwordChangedAt) {
      const changedTimestamp = parseInt(
        this.passwordChangedAt.getTime() / 1000,
        10
      );
      return JWTTimestamp < changedTimestamp;
    }

    // False means NOT changed
    return false;
  };

  User.prototype.createPasswordResetToken = function() {
    const resetToken = crypto.randomBytes(32).toString('hex');

    this.passwordResetToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

    return resetToken;
  };

  User.associate = function(models) {
    // associations can be defined here
    User.hasMany(models.Task, {
      foreignKey: 'userId',
      as: 'tasks',
      onDelete: 'CASCADE'
    });
  };
  return User;
};
