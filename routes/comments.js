//As afte the Refactoring the routes into separate files, an errors would show up as the (app.)would not be defined in the new code location, to solve it we use Express Router.
//Then we change the app.something to router.something 
var express = require("express");
var router  = express.Router({mergeParams: true});//mergeParams: true - this would help us mergin the campgrounds and comments to get access to the :id. if we didnt do it we will have an error stating the user is null! 

var Campground = require("../models/campground");
var Comment    = require("../models/comment");
var middleware = require("../middleware");



//=====================
//  Comment Routs
//=====================

router.get("/new", middleware.isLoggedIn,function(req, res){
    //Find campground by id and render it back to comments/new
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
        }else {
            res.render("comments/new", {campground: campground});
        }
    });
        
});

//Post route for the comments
router.post("/", middleware.isLoggedIn,function(req, res){
    //look up campgrounds using ID
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
        }else{
    //Create new comments
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    req.flash("error", "Something went wrong!"); 
                    console.log(err);
                }  else{
                    //add username and id to comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    //save comment
                    comment.save();
                    //Connect new comment to campground
                    campground.comments.push(comment);
                    //Save it the the DB
                    campground.save();
                    req.flash("success", "Successfully added comment"); 
                    //Redirect to campground show page
                    res.redirect("/campgrounds/" + campground._id);
                }
            });
        }
    });
});

//Comments Edit Route
router.get("/:comment_id/edit", middleware.checkCommentOwnership ,function(req, res){
    Comment.findById(req.params.comment.id, function(err, foundComment){
        if(err){
            res.redirect("back");
        }else{
            res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});

        }
    });
});


//Comment Update Route
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if(err){
            res.redirect("back");
        }else{
            res.redirect("/campgrounds/" + req.params.id);
        }
    })
})

//Comment Destroy Route
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res){
        //findByidAndRemove
        Comment.findByIdAndRemove(req.params.comment_id, function(err){
            if(err){
                res.redirect("back");
            }else{
                req.flash("success", "Comment deleted!"); 
                res.redirect("/campgrounds/" + req.params.id);
            }
        });

});




module.exports = router;