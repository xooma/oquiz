const Sequelize = require('sequelize');

const dbConnection = require('../db_connection');

class Question extends Sequelize.Model {
  
};

Question.init({
  question: {
    type: Sequelize.TEXT,
    allowNull: false
  },
  anecdote: Sequelize.TEXT,
  wiki: Sequelize.TEXT,
  status: {
    type: Sequelize.INTEGER,
    allowNull: false
  }
}, {
  sequelize: dbConnection,
  tableName: "questions",
  createdAt: "created_at",
  updatedAt: "updated_at"
});

module.exports = Question;