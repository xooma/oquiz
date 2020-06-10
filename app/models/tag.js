const Sequelize = require('sequelize');

const dbConnection = require('../db_connection');

class Tag extends Sequelize.Model {
  // Remarque importante : on DOIT enlever les propriétés déclarées
  // C'est un bug connu de Sequelize, si on les défini ici, Sequelize ne les trouve plus et ils restent tous NULL

  getName () {
    return "Je suis le tag "+this.name;
  };

};

// Avec Sequelize, on DOIT définir les propriétés en appelant la méthode statique "init"
Tag.init({
  // ici on définit les propriétés de Tag
  // Mais Sequelize définit par défaut : un id (donc pas besoin de le redéfinir), et des timestamps (cf 2ème objet)
  name: Sequelize.TEXT, // <= je dit à Sequelize "name existe, et est du type "TEXT"
  status: Sequelize.INTEGER

},{
  // Ici on définit les options du model
  sequelize: dbConnection,  // <= la connection à la BDD
  createdAt: "created_at", // <= le nom des champs TIMESTAMPS. Remarque : on peut aussi lui donner false pour désactiver les timestamps
  updatedAt: "updated_at",

  tableName: "tags" // <= on donne la table qui correspond au model
});


module.exports = Tag;