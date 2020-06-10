require ('dotenv').config();

const Answer = require('./answer');
const Level = require('./level');
const Question = require('./question');
const Tag = require('./tag');
const User = require('./user');
const Quiz = require('./quiz');

/** Associations */
// une fois le modèle défini (avec init), on peut définir les "liens" entre les différentes entités. Pour ça on utilise le principe d'association (https://sequelize.org/v5/manual/associations.html)

// association Quiz <-> User ("un quiz appartient à un auteur")
Quiz.belongsTo( User ,{
  foreignKey: "app_users_id",
  as: "author"
});

// et la réciproque ("un User est l'auteur de plusieurs quizzes")
User.hasMany( Quiz, {
  foreignKey: "app_users_id",
  as: "quizzes"
});


// Quizz <-> Question
// "un Quiz possède plusieurs Questions"
Quiz.hasMany( Question, {
  foreignKey: "quizzes_id",
  as: "questions"
});
// la réciproque " une question appartient à un seul quiz"
Question.belongsTo( Quiz, {
  foreignKey: "quizzes_id",
  as: "quiz"
});


// Question <-> Level
// "une Question appartient à un Level"
Question.belongsTo(Level, {
  foreignKey: "levels_id",
  as: "level"
});

// "un Level possède(concerne ?) plusieurs questions"
Level.hasMany(Question, {
  foreignKey: "levels_id",
  as: "questions"
});


// Quizz <-> Tag
// Relation de type N:N, utilisant une table de liaison
// "un tag appartient à plusieurs Quiz"
Tag.belongsToMany(Quiz, { // pour définir une association N:N, on donne : 
  through: "quizzes_has_tags", // <= le nom de la table de liaison
  foreignKey: "tags_id", // <= le nom de la clef du modèle qui lance la méthode
  otherKey: "quizzes_id", // <=  le nom de la clef de l'autre modèle
  timestamps: false, // <= on désactive les timestamps !
  as: "quizzes"
});

// "un Quiz appartient à plusieurs Tag"
Quiz.belongsToMany(Tag, {
  through: "quizzes_has_tags",
  foreignKey: "quizzes_id",
  otherKey: "tags_id",
  timestamps: false,
  as: "tags"
});


// Question <-> Answer, première relation : les réponses possibles
// "1 question possède N réponses possibles"
Question.hasMany(Answer, {
  foreignKey: "questions_id",
  as: "answers"
});

// "une réponse appartient à une seule question"
Answer.belongsTo(Question, {
  foreignKey: "questions_id",
  as: "question"
});


// Question <-> Answer, deuxième relation : la bonne réponse
// "une Question possède une seule bonne réponse"
// NOTE: instinctivement, on voudrait utiliser hasOne, mais hasOne cherche la clef étrangère dans le modèle "cible" (celui passé en paramètre !)
// en fait ici, on utilise belongsTo car c'est la seule association qui permet de définir une clef étrangère dans le modèle lui-même.
Question.belongsTo( Answer , {
  foreignKey: "answers_id",
  as: "good_answer"
});




// une fois qu'on a créé les associations, on ré-exporte TOUS les modèles
module.exports = {Answer, Level, Question, Tag, User, Quiz};
