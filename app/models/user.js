const Sequelize = require('sequelize');

const dbConnection = require('../db_connection');

class User extends Sequelize.Model {

  getFullName() {
    return this.firstname + ' '+ this.lastname;
  };

};

User.init({
  email: {
    type: Sequelize.TEXT,
    allowNull: false, 
    unique: true
  },
  password: {
    type: Sequelize.TEXT,
    allowNull: false
  },
  firstname: {
    type: Sequelize.TEXT,
    allowNull: false
  },
  lastname: {
    type: Sequelize.TEXT,
    allowNull: false
  },
  status: Sequelize.INTEGER ,
  role: {
    type: Sequelize.TEXT,
    allowNull: false,
    defaultValue: "user"
  }
}, {
  sequelize: dbConnection,
  tableName: "app_users",
  createdAt: "created_at",
  updatedAt: "updated_at"
});

module.exports = User;
