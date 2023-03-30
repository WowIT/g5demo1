

let express = require('express');
let router = express.Router();

module.exports.displayHomePage = (req, res, next) => {
    res.render('home', { title: 'Home', displayName: req.user ? req.user.displayName : '' });
}
