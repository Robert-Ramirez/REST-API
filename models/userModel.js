const Sequelize = require('sequelize');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const sequelize = require('../utils/database');

const User = sequelize.define(
  'user',
  {
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

module.exports = User;
