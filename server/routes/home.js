

var express = require('express');
var router = express.Router();

let homeController = require('../controllers/home');
let authController = require('../controllers/auth');

/* GET home page. */
router.get('/', homeController.displayHomePage);

/* GET home page. */
router.get('/home', homeController.displayHomePage);

/* GET Route for displaying the Login Page */
router.get('/login', authController.displayLoginPage);

/* POST Route for displaying the Login Page */
router.post('/login', authController.processLoginPage);

/* GET Route for displaying the Register Page */
router.get('/register', authController.displayRegisterPage);

/* POST Route for displaying the Register Page */
router.post('/register', authController.processRegisterPage);

/* GET Route to perform UserLogout */
router.get('/logout', authController.performLogout);

module.exports = router;
