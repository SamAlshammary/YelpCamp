//As afte the Refactoring the routes into separate files, an errors would show up as the (app.)would not be defined in the new code location, to solve it we use Express Router.
//Then we change the app.something to router.something 
var express = require("express");
var router  = express.Router(); 


var Campground = require("../models/campground");
var middleware = require("../middleware");

//==================
//Campgrounds Index
//==================

//Index - Shows all campgroounds. Campgrounds route page
router.get("/", function(req, res){
    //Get all the campgrounds from DB
    Campground.find({}, function(err, allCampgrounds){
        if (err){
            console.log(err);
        } else {
            //the page we want to render to, and pass the data to
            res.render("campgrounds/index", {campgrounds: allCampgrounds} );
        }
    });
});


//Create - Add to campgrounds
router.post("/", middleware.isLoggedIn ,function(req, res){
   
    // get data from form and add to campground array
    var name = req.body.name;
    var price = req.body.price;
    var image = req.body.image;
    var desc = req.body.description;
    //to include the author name in the campground upon creating it. 
    var author = {
            id: req.user._id,
            username: req.user.username
         }
    var newCampground = {name: name, image: image, price: price, description: desc, author: author}  //creating an object to store in it the name, image and description in order to push to this array object
    //create a new campground and save to DB
    Campground.create(newCampground, function(err, newlyCreated){
        if (err){
            console.log(err);
        }else {
             //redirect back to campgrounds page
              res.redirect("/campgrounds");
        }
    });
});

//New - creating the form route to add new campgrounds
router.get("/new", middleware.isLoggedIn,function(req, res){
    res.render("campgrounds/new");
});

//Show route - shows more info about one campground
router.get("/:id", function(req, res){
    //find campground with provided id
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err){
            console.log(err);
        }else {
            console.log(foundCampground);
                //render show template with that campground
                res.render("campgrounds/show", {campground: foundCampground});

        }
    });
    

});

//Edit Campground Route
router.get("/:id/edit", middleware.checkCampgroundOwnership,function(req, res){
             
                    Campground.findById(req.params.id, function(err, foundCampground){
                                res.render("campgrounds/edit", {campground: foundCampground});
                        
});
});

//Update Campground Route
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
            //find and update the correct campground
            Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
                if(err){
                    res.redirect("/campgrounds");
                }else{
                   //redirect somewhere (show page)
                    res.redirect("/campgrounds/" + req.params.id);
                }
            });
         

}); 


//Destroy Campground Route
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/campgrounds");
        }else{
            res.redirect("/campgrounds");
        }
    });
});

//after changing app to router, we need to export something from this file
module.exports = router;