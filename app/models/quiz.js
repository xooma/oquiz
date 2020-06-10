const Sequelize = require('sequelize');

const dbConnection = require('../db_connection');

class Quiz extends Sequelize.Model {

};

Quiz.init({
  title: {
    type: Sequelize.TEXT,
    allowNull: false
  },
  description: Sequelize.TEXT
  // NOTE : on ne définit même pas le champ "app_users_id" (pour l'instant)
  // SPOILER :  on le définira grâce aux Associations !!
  // app_users_id: {
  //   type: Sequelize.INTEGER,
  //   allowNull: false
  // }
}, {
  sequelize: dbConnection,
  tableName: "quizzes",
  createdAt: "created_at",
  updatedAt: "updated_at"
});



module.exports = Quiz;

