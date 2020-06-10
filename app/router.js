const express = require('express');
const router = express.Router();

const mainController = require('./controllers/mainController');
const quizController = require('./controllers/quizController');
const tagController = require('./controllers/tagController');
const authController = require('./controllers/authController');
const userController = require('./controllers/userController');
const adminController = require('./controllers/adminController');
const userMiddleware = require('../app/middlewares/user');


router.get('/', mainController.homePage);

router.get('/quiz/:id', quizController.getQuestions);
router.post('/quiz/:id', quizController.getResult);

router.get('/tags/:id', tagController.getOneTag);
router.get('/login', authController.loginPage);
router.post('/login', authController.loginAction);
router.get('/signup', authController.signupPage);
router.post('/signup', authController.signupAction );
router.get('/profile', userMiddleware.connectedUser, userController.getProfile);

router.get('/admin', userMiddleware.connectedUser, userMiddleware.connectedAdmin, adminController.getAdmin);
router.get('/addTag', userMiddleware.connectedUser, userMiddleware.connectedAdmin,adminController.addTagPage)
router.post('/addTag', userMiddleware.connectedUser, userMiddleware.connectedAdmin,adminController.sendNewTag)
router.get('/editTag', userMiddleware.connectedUser, userMiddleware.connectedAdmin,adminController.editTagPage)
router.post('/editTag', userMiddleware.connectedUser, userMiddleware.connectedAdmin,adminController.editTag)
router.post('/editGoodTag', userMiddleware.connectedUser, userMiddleware.connectedAdmin,adminController.sendEditedTag)

router.get('/logout', authController.logout );

router.use( (req, res) => {res.status(404).render('404')} );

module.exports = router;