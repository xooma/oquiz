const Sequelize = require('sequelize');

const dbConnection = require('../db_connection');

class Answer extends Sequelize.Model {
};

Answer.init({
  description: {
    type: Sequelize.TEXT,
    allowNull: false
  },
  status: {
    type: Sequelize.INTEGER,
    allowNull: false
  }
}, {
  sequelize: dbConnection,
  tableName: "answers",
  createdAt: "created_at",
  updatedAt: "updated_at"
})

module.exports = Answer;