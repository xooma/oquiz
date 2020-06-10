const dbConnection = require('../db_connection');

class CoreModel {
  id;
  created_at;
  updated_at;
  status;

  constructor (obj) {
    this.id = obj.id;
    this.created_at = obj.created_at;
    this.updated_at = obj.updated_at;
    this.status = obj.status;
  };

  getId () {
    return this.id;
  };

  setId (value) {
    // on veut vérifier que value est bien un nombre entier
    if ( Number.isInteger(value) ) {
      this.id = value;
    } else {
      // on va "lever" (ou "jeter") une exception
      // une exception, c'est une erreur qui est levée (ou jetée)
      throw Error("ID must be an integer value");
    }

  };

  printThis() {
    console.log(this);
  };

  static printStaticThis () {
    console.log(this);
  };

  /** Méthodes Active Record */

  // une méthode pour récupérer les modeles dans la BDD
  static findAll (callback) {
    // on crée une query

    // pour pouvoir spécifier la table dans laquelle aller chercher les infos
    // on utilise une variable statique DANS CHAQUE CLASSE
    // Lorsqu'on appellera cette méthode avec "User.findAll", alors this correspondra à User, et donc `this.tableName` sera la propriété tableName DE USER.
    // De même, quand on appellera "Tag.findById", alors this sera Tag, et donc this.tableName sera Tag.tableName (donc "tags")
    const query = `SELECT * FROM "${this.tableName}"`;

    // on passe la requete au client, avec le callback
    dbConnection.query(query, (err, data) => {
      // si on a une erreur, on appelle le callback en lui passant uniquement l'erreur
      if (err) {
        callback(err, null);
      } else {
        // on transforme le résultat de la requete en liste de User
        const allModels = []; // on prépare un array pour y mettre les vrais User
        // ensuite, on boucle sur les résultats de la requete
        for (let obj of data.rows) {
          // on peut créer un model avec les valeurs de l'objet et l'ajouter à la liste
          allModels.push( new this(obj) );
        }
        // et ENFIN, appeller le callback en lui passant la liste des VRAIS User
        callback(null, allModels);
      }
    });
  };

  // une méthode pour récupérer un seul modèle, via son ID
  static findById (id, callback) {
    // 1. construire une requete préparée (donc avec un tableau "values")
    const query = `SELECT * FROM "${this.tableName}" WHERE "id"= $1`;
    const values = [id];

    // 2. lancer la requete...
    dbConnection.query( query, values, (err, data) => {
      if (err) {
        // si j'ai une erreur, je la refile au callback.
        callback(err, null);
      } else {
        // PRE-3: on va vérifier que le résultat existe avant d'essayer de le transformer
        // on peut : tester data.rowCount OU tester si firstResult est défini, OU tenter la transformation dans un try/cath
        const firstResult = data.rows[0];
        
        if (firstResult) {
          // 3. transformer le premier résultat en instance du modele
          const myModel = new this(firstResult);

          // 4. passer le modele au callback
          callback(null, myModel);
        } else {
          // dans le cas ou la requete n'a pas renvoyé de résultat, on va passer "undefined" au callback
          callback(null, undefined);
        }
      }
    });
    
  };

  // une méthode pour supprimer L'INSTANCE COURANTE de la BDD
  delete (callback) {
    // 1. construire une requete (et le tableau de valeur)    
    // il faut qu'on retrouve le nom de la table
    // sauf que, ici on est pas dans une méthode statique
    // donc this, c'est un objet (l'instance courante), et pas la classe 
    // comment retrouver le nom de la classe depuis this ? => this.constructor
    const query = `DELETE FROM "${this.constructor.tableName}" WHERE "id" = $1`;
    const values = [ this.id ];

    // 2. lancer la requete (avec le callback)
    dbConnection.query(query, values, callback);
  };


  // une méthode pour insérer L'INSTANCE COURANTE dans la bdd. (=> insert into)
  insert (callback) {
    // 1. créer une query, et le tableau de valeurs qui correspond
    // SAUF QUE, en fonction du type de l'objet qui appelle cette méthode, ça ne sera pas toujours les même propriétés (Tag n'a pas les mêmes propriétés que User ou que Question)
    // Il faut qu'on génère une requete EN FONCTION des propriétés de l'objet courant (donc de "this")
    // pour ça, on peut utiliser 2 manière : 
    // - la fonction Object.keys(obj) renvoie une liste des propriétés de l'objet
    // - la boucle for...in permet parcourir les propriétés d'un objet

    // utilisons donc for...in pour créer la requete !
    // pour ça on va créer un tableau "tableStruct" qui va décrire la table visée,
    // et EN MEME TEMPS, on va construire le tableau values
    const tableStruct = [];
    const values = [];
    const dollars = [];

    // pour chacune des propriétés de mon objet
    let indexDollars = 1;
    for (let prop in this) {
      if (prop !== 'id' && prop !== 'created_at' && prop !== 'updated_at') {
        // j'ajoute la propriété à tableStruct
        tableStruct.push(prop);
        // et en même temps, j'ajoute la valeur dans le tableau values
        values.push( this[prop] );
        // et on construit aussi un tableau qui contient des $1, $2,...
        dollars.push( '$'+indexDollars );
        indexDollars++;
      }
    }

    // console.log( tableStruct );
    // console.log( dollars );
    // console.log( values );

    const query = `INSERT INTO "${this.constructor.tableName}" (${tableStruct}) VALUES (${dollars}) RETURNING id, created_at`;

    // console.log(query);    

    // 2. lancer la query dans la BDD.
    dbConnection.query(query, values, (err, data) => {
      if (err) {
        callback(err, null);
      } else {
        // si l'insertion s'est bien passé, on va récupérer dans data.rows[0] les infos qu'on a demandé à la base de données (avec le RETURNING)
        const returnedInfos = data.rows[0];
        // on met à jour l'instance courante avec les infos récupérées de la DB
        this.id = returnedInfos.id;
        this.created_at = returnedInfos.created_at;
        // il me reste à appeler le callback, en lui passant la nouvelle version de l'instance courante
        // c'est à dire : this
        callback(null, this);
      }
    });
  };

  update (callback) {
    // on veut executer une requete SQL "UPDATE ..." en utilisant les données de this.
    // 1. construire la requete
    // Même constat que dans la méthode insert : on doit construire une requête spécifique à l'objet courant. On va donc utiliser le même genre d'astuce : for...in pour parcourir les propriétés de l'objet.

    // on se prépare un tableau pour receuillir les ` "champ" = $x `
    const updateStrings = [];
    // et un tableau de valeur
    const values = [];
    // et un indice pour compter les $
    let indiceDollars = 1;

    // pour chaque propriété de l'objet
    for (let prop in this) {
      // on filtre les propriétés qui nous interesse pas
      if (prop !== 'id' && prop !== 'created_at' && prop !== 'updated_at') {
        // on construit une string ` "champ" = $x `
        let string = ` "${prop}" = $${indiceDollars}`;
        indiceDollars++;
        updateStrings.push(string);
        // au passage, on rajoute la valeur dans le tableau de valeurs
        values.push( this[prop] );
      }
    }
    // on rajoute à la fin, la propriété "updated_at", qui sera toujours la meme : CURRENT_TIMESTAMP
    updateStrings.push( ` "updated_at" = CURRENT_TIMESTAMP ` );

    // comme le dernier dollar va servir à spécifier l'id de l'objet à update, je dois ajouter l'id en question dans le tableau de valeur
    values.push(this.id);

    // console.log(updateStrings);
    // console.log(values);

    const query = ` UPDATE ${this.constructor.tableName} SET ${updateStrings} WHERE "id" = $${indiceDollars} RETURNING updated_at`;

    // console.log(query);
    

    // 2. lancer la requete
    dbConnection.query( query, values, (err, data) => {
      // on oublie pas le traitement d'erreur !
      if (err) { return callback(err, null ); }
      
      // 3. au retour, éventuellement mettre à jour this, en utilisant les données retournées par postgres lors de la mise à jour.
      const returnedInfos = data.rows[0];

      this.updated_at = returnedInfos.updated_at;

      // 4. lancer le callback en lui passant this
      callback(err, this);
    });
  };

  // Une petite fonction utilitaire pour insérer OU update
  save (callback) {
    // si l'instance correspond à un enregistrement dans la BDD, alors elle FORCÈMENT un id
    // à l'inverse, si on vient de la créer à la main, l'instance n'a pas d'id !

    if (this.id) {
      return this.update(callback);
    } else {
      this.insert(callback);
    }

  };

  // une méthode pour trouver des instances en fonction de paramètres non définis à l'avance !
  static findBy (params, callback) {
    // on va devoir générer une requete en fonction de l'objet params
    // pour ça, on fait un peu comme dans insert ou update, on boucle sur l'objet en préparant des values à insérer dans la query
    let arrayOfConditions = [' 1 = 1 '];
    let indexDollars = 1;
    let values = [];

    for (let prop in params) {
      let condition = ` ${prop} = $${indexDollars} `;
      arrayOfConditions.push(condition);
      values.push( params[prop] );
      indexDollars++;
    }

    const query = `SELECT * FROM ${this.tableName} WHERE ${arrayOfConditions.join(" AND ")}`;

    // console.log(query);

    // on passe la requete au client, avec le callback (EXACTEMENT ce qu'on fait dans findAll)
    dbConnection.query(query, values, (err, data) => {
      // si on a une erreur, on appelle le callback en lui passant uniquement l'erreur
      if (err) {
        callback(err, null);
      } else {
        // on transforme le résultat de la requete en liste de User
        const allModels = []; // on prépare un array pour y mettre les vrais User
        // ensuite, on boucle sur les résultats de la requete
        for (let obj of data.rows) {
          // on peut créer un model avec les valeurs de l'objet et l'ajouter à la liste
          allModels.push( new this(obj) );
        }
        // et ENFIN, appeller le callback en lui passant la liste des VRAIS User
        callback(null, allModels);
      }
    });

  };
  
};

module.exports = CoreModel;