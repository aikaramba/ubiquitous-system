const express = require("express");
const passport = require("passport");
const users = require("./data/users.json");
const _ = require("lodash");

let router = express.Router();
module.exports = router;

router.route("/login")
    .get((req, res) => {
        if(req.app.get("env") === "development"){
            let user = users[0];
            if(req.query.user){
                user = _.find(users, u => u.name === req.query.user);
            }
            req.logIn(user, (err) => {
                if(err){return next(err);}
                return res.redirect('/');
            });
            return;
        }
        res.render("login");
    })
    .post(passport.authenticate('local', {
            successRedirect: '/',
            failureRedirect: '/login'
    }));

router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/login');
});
