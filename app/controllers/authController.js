const { User } = require('../models');

// une libraire pour tester le format des email
const emailValidator = require('email-validator');

// bcrypt, pour HASHER les mots de passer
const bcrypt = require('bcrypt');

const authController = {

  // afficher le formulaire de connexion
  loginPage: (req, res) => {
    res.render('login');
  },

  // traiter le formulaire de connexion
  loginAction: async (req, res) => {
    try {
      const {email, password} = req.body;

      const user = await User.findOne({
        where: {
          email: email
        }
      });
      
      if (!user) {
        return res.render('login', {
          error: "Cet email n'existe pas"
        });
      }

      if(! bcrypt.compareSync(password, user.password)) {
        return res.render('login', {
          error: "Mauvais mot de passe"
        });
      }

      req.session.user = user;
      res.redirect('/');
    } catch {
      console.trace(err);
      res.status(500).render('500', {err});
    }
  },

  // afficher le formulaire d'inscription
  signupPage: (req, res) => {
    res.render('signup');
  },

  // traiter le formulaire d'inscription => enregistrer un nouveau User
  signupAction: async (req, res) => {
    try {
      // récupérer les données du formulaire
      const data = req.body;

      // NTUI => vérifier ques les infos sont "logiques"

      // - vérifier que l'utilisateur n'existe pas déjà (via son email)
      const user = await User.findOne({
        where: {
          email: data.email
        }
      });

       // on se prépare une liste vide, destinée à recevoir les erreur
       let errorsList = [];

       if (user) {
         errorsList.push('Cet email existe déjà');
       }
 
       // - nom et prénom non vide
       if (!data.firstname) {
         errorsList.push("Le prénom ne peut pas être vide");
       }
       if (!data.lastname) {
         errorsList.push("Le nom ne peut pas être vide");
       }
       // - adresse email au bon format
       if (!emailValidator.validate(data.email)) {
         errorsList.push("L'email n'est pas un email correct");
       }
 
       // - longueur minimum du mot de passe (8 caractère minimum !)
       if (data.password.length < 8) {
         errorsList.push("Le mot de passe doit contenir un minimum de 8 caractères");
       }
 
       // - mot de passe = confirmation
       if (data.password !== data['password-confirm'] ) {
         errorsList.push("Le mot de passe et la confirmation ne correspondent pas");
       }
 
       // Si on a au moins une erreur, on réaffiche le formulaire en affichant les erreurs
 
       // SI TOUT VA BIEN : insérer les données dans la BDD (puis rediriger l'utilisateur )
       // si tout va bien, errorsList est vide
       if (errorsList.length === 0) {
          // on peut créer le User !
          const newUser = new User();
          newUser.firstname = data.firstname;
          newUser.lastname = data.lastname;
          newUser.email = data.email;
          // on HASH le mot de passe
          newUser.password = bcrypt.hashSync(data.password, 10);
 
          const savedUser = await newUser.save();
          // on récupère un utilisateur => on le met directement en session => le nouveau est déjà loggé !
          req.session.user = savedUser;
          res.redirect('/');
 
       } else {
         res.render('signup', {
           errorsList
         });
       }


    } catch (error) {
      console.trace(err);
      res.status(500).render('500', {err});
    }

  },

  logout: (req, res) => {
    delete req.session.user;
    res.redirect('/');
  }

};


module.exports = authController;