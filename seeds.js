var mongoose         = require("mongoose");
var Campground       = require("./models/campground"); //using the campground module
var Comment          = require("./models/comment");

var data = [
    {
        name: "Cloud's Rest",
        image: "https://pixabay.com/get/57e1dd4a4350a514f1dc84609620367d1c3ed9e04e507440752a7cd0954bc2_340.jpg",
        description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
    },
    {
        name: "Fire Camping",
        image: "https://pixabay.com/get/52e8d4444255ae14f1dc84609620367d1c3ed9e04e507440752a7cd0954bc2_340.jpg",
        description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
    },
    {
        name: "Mother Nature",
        image: "https://pixabay.com/get/57e8d0424a5bae14f1dc84609620367d1c3ed9e04e507440752a7cd0954bc2_340.jpg",
        description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
    }

]

function seedDB(){
            //to remove everything from the DB
            Campground.remove({}, function(err){
                if(err){
                    console.log(err);
                }
                    console.log("removed campgrounds");
                            //Add few campgrounds
                        data.forEach(function(seed){
                            Campground.create(seed, function(err, campground){
                                if(err){
                                    console.log(err);
                                }else{
                                    console.log("Added A Campground");
                                    //Create a comment
                                    Comment.create({
                                        text: "This place is great, but i wish there was a bathroom",
                                        author: "Homer"
                                        }, function(err, comment){
                                            if(err){
                                                console.log(err);
                                            }else{
                                                campground.comments.push(comment);
                                                campground.save();
                                                console.log("Created new comment");
                                            }
                                                
                                        });
                                    }
                                });
                            });
                        });
            //Add a few comments
      }

module.exports = seedDB;
