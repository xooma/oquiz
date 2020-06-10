const { Tag } = require('../models');

const adminController = {
  
  getAdmin : (req, res) => {
    res.render('admin');   
  },

  addTagPage: (req, res) => {
    res.render('addTag');
  },

  sendNewTag: async (req, res) => {
    const name = req.body.name
    try {
        const newTag = await Tag.create(
          {
            name: name
          });
        if (!newTag) {
          return next();
        } else {
          res.render('addTag', {
              newTag
          })
        }
    } catch (err) {
        console.trace(err);
        res.status(500).render('500', {
            err
        });
    }
  },

  editTagPage: async (req, res) => {
    try {
        const tags = await Tag.findAll({
            include: [{
                association: "quizzes",
                include: ["author"]
            }]
        });
        if (!tags) {
            return next();
        }
        res.render('editTag', {
            tags
        });
    } catch (err) {
        console.trace(err);
        res.status(500).render('500', {
            err
        });
    }
  },

  editTag: async (req, res) => {
    try {
      const goodTag = req.body.tag
      const tag = await Tag.findByPk(goodTag);
    res.render('editTag', {
      goodTag,
      tag
    } )
    } catch (err) {
      console.trace(err);
      res.status(500).render('500', {
          err
      });
    }
  },

  sendEditedTag: async (req, res) => {
    const tag = req.body
    console.log(tag)
    try {
        const editedTag = await Tag.update(
          {
            name: tag.name,
            status: tag.status
          });
        if (!editedTag) {
          return next();
        } else {
          res.render('editTag', {
              editedTag
          })
        }
    } catch (err) {
        console.trace(err);
        res.status(500).render('500', {
            err
        });
    }
  }
};

module.exports = adminController;
