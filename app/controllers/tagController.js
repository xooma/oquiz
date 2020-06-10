const { Tag } = require('../models');


const tagController = {

    // getTags: async (req, res) => {
    //     try {
    //         const tags = await Tag.findAll();
    //         res.render('tags', {
    //             tags
    //          });   
    //     } catch (err) {
    //         console.trace(err);
    //         res.status(500).send(500, {err});
    //     }
    // },

    getOneTag: async (req, res) => {
        try {
            const id = req.params.id
            const tags = await Tag.findByPk(id, {
                include: [{
                    association: "quizzes",
                    include: ["author"]
                }]
            });
            if (!tags) {
                return next();
            }
            res.render('quizzesByTag', {
                tags
            });
        } catch (err) {
            console.trace(err);
            res.status(500).render('500', {
                err
            });
        }
    },
};

module.exports = tagController;