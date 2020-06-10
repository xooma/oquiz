const Sequelize = require('sequelize');

const dbConnection = require('../db_connection');

class Level extends Sequelize.Model {

};

Level.init({
  name: { // plutpôt que de donner directement un type, on peut lui passer un objet pour définir plein d'options
    type: Sequelize.TEXT,
    allowNull: false // <= équivalent du NOT NULL de SQL

  },
  status: Sequelize.INTEGER
}, {
  sequelize: dbConnection,
  tableName: "levels",
  createdAt: "created_at",
  updatedAt: "updated_at"
});

module.exports = Level;