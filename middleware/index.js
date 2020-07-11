//All the middleware goes here
var Campground = require("../models/campground");
var Comment = require("../models/comment")
var middlewareObj = {};

//Middleware function to Check the ownership for a campground, in orde to authorize the edit and delete functionality
middlewareObj.checkCampgroundOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        Campground.findById(req.params.id, function(err, foundCampground){
            if(err){
                req.flash("error", "Campground not found!"); 
                res.redirect("back");
                }else{
                //does user own the campground?
                if(foundCampground.author.id.equals(req.user._id)) {
                                next();
                }else{
                    req.flash("error", "You don't have permission to do that!"); 
                    res.redirect("back"); //"back"  this will take the user the previous page.
                }  
            
            }
        });
    }else {
        req.flash("error", "You need to be logged in to do that!"); 
        res.redirect("back");
    }
}




//Middleware function to Check the ownership for a comment, in orde to authorize the edit and delete functionality
middlewareObj.checkCommentOwnership = function (req, res, next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err){
                res.redirect("back");
                }else{
                //does user own the comment?
                if(foundComment.author.id.equals(req.user._id)) {
                                next();
                }else{
                    req.flash("error", "You don't have permission to do that!");
                    res.redirect("back"); //"back"  this will take the user the previous page.
                }  
            
            }
        });
    }else{
        req.flash("error", "You need to be logged in to do that!"); 
        res.redirect("back");
    }
}

//isLoggedIn middleware function
middlewareObj.isLoggedIn = function (req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You need to be logged in to do that!");    //using flash package
    res.redirect("/login"); 
}



module.exports = middlewareObj;