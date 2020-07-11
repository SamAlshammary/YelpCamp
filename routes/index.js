//As afte the Refactoring the routes into separate files, an errors would show up as the (app.)would not be defined in the new code location, to solve it we use Express Router.
//Then we change the app.something to router.something 
var express = require("express");
var router  = express.Router(); 

var passport = require("passport");
var User    = require("../models/user");
 
//=======
//ROUTES
//=======
//Root page Route
router.get("/", function(req, res){
    res.render("landing");
});


//============
//AUTH ROUTES
//============

//show register form
router.get("/register", function(req, res){
        res.render("register");
});

//handle sign up logic
router.post("/register", function(req, res){
        var newUser = new User({username: req.body.username});
       //the below command is provided by passport local mongoose
        User.register(newUser, req.body.password, function(err, user){
                if(err){
                    req.flash("error", err.message); 
                    return res.render("register");
                }
                passport.authenticate("local")(req, res, function(){
                    req.flash("success", "Welcome to YelpCamp " + user.username); 
                    res.redirect("/campgrounds");
                });
        } );
});

//Show Login Form
router.get("/login", function(req, res){
        res.render("login");
});

//Handling login logic - passport.authenticate is a middleware by passport local mongoose package
router.post("/login", passport.authenticate("local",
 {
     successRedirect: "/campgrounds",
     failureRedirect: "/login"

    }), function(req, res){
});

//Log out Route
router.get("/logout", function (req, res){
    req.logout();
    req.flash("success", "Logged You Out!");
    res.redirect("/campgrounds");
});



module.exports = router;