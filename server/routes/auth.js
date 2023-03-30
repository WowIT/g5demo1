

let express = require('express');
let passport = require('passport');
let router = express.Router();

// @desc Auth with Google
//@route GET /auth/google
router.get('/google', passport.authenticate('google', {scope: ['profile', 'email'] }));

// @desc Google auth callback
//@route GET /auth/google/callback
router.get('/google/callback',
        passport.authenticate('google', {failureRedirect: '/'}),
        (req, res) => {
            res.redirect('/')
        });

module.exports = router;
