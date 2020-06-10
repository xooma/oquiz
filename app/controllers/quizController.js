const { Quiz, Question } = require('../models');


const quizzController = {

    getQuestions: async (req, res, next) => {
      try {
        const quizId = req.params.id;

        let quiz = await Quiz.findByPk(quizId, {
          include: [
            "author",
            {
              association: "questions",
              include: ["level", "answers"]
            },
            "tags"
          ]
        });

        if (!quiz) {
          return next();
        }
        if (req.session.user) {
        res.render('play_quiz', {
          quiz
        });
               
        } else {
          res.render('quiz', {
            quiz
          });
        }
      } catch (err) {
        console.trace(err);
        res.status(500).render('500', {
          err
        });
      }
    },

    getResult: async (req, res) => {
      try {
        const data = req.body;
        const quizId = req.params.id;
        let result = [];
        let quiz = await Quiz.findByPk(quizId, {
          include: [
            "author",
            {
              association: "questions",
              include: ["level", "answers", "good_answer"]
            },
            "tags"
          ]
        });
        for (let question of quiz.questions) {
          if (data[question.id] == question.id) {
            result.push(data[question.id]);
          }
        }
        res.render('result_quiz', {
          quiz,
          result,
          data
        })
      } catch (err) {
        console.trace(err);
        res.status(500).render('500', {
          err
        });
      }  
    },
};

module.exports = quizzController;