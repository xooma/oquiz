// SoC: le role de ce fichier est UNIQUEMENT de fournir une connexion ouverte à la BDD

// const { Client } = require('pg');

// // on instancie un client ...
// const client = new Client(process.env.PG_URL);

// // ... qu'on connecte...
// client.connect();

// // ... et qu'on exporte !
// module.exports = client;

// NOUVELLE VERSION utilisant Sequelize

const Sequelize = require('sequelize');

// on instancie la connection 
const dbConnection = new Sequelize(process.env.PG_URL);

// et on l'exporte !
module.exports = dbConnection;

