const { Quiz, Tag } = require('../models');


const mainController = {

   homePage: async (req, res) => {
      try {

        let quizzes = await Quiz.findAll({
          include: ["author"]
        });
        let tags = await Tag.findAll();
  
        res.render('index', {
          quizzes,
          tags
        });
  
      } catch (err) {
        console.trace(err);
        res.status(500).render('500', {err});
      }
    },
};

// on oublie pas d'exporter notre module
module.exports = mainController;
