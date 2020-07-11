var express          = require("express");
var app              = express();
var bodyParser       = require("body-parser"); //including the body parser
var mongoose         = require("mongoose"); //including mongoose
var flash            = require("connect-flash"); //including flash package
var passport         = require("passport"); //passport for Auth
var LocalStrategy    = require("passport-local");   
var methodOverride   = require("method-override");
var Campground       = require("./models/campground"); //using the campground module
var Comment          = require("./models/comment");
var User             = require("./models/user");
var seedDB           = require("./seeds");

//Requiring Routes
var commentRoutes    = require("./routes/comments");
var campgroundRoutes = require("./routes/camgrounds");
var indexRoutes       = require("./routes/index");  //Auth routes is in here


//creating the yelp camp in the mongodb
mongoose.connect("mongodb://localhost:27017/yelp_camp", {useNewUrlParser: true, useUnifiedTopology: true});

app.use(bodyParser.urlencoded({extended: true}));   //setting up to use body parser in the app
app.set("view engine", "ejs"); //set the ejs

//Including our CSS file - __dirname: referes to the dirctory the script is running; EX: when we console.log(__dirname) we get /Users/hussamalshammary/Desktop/WebDeveloper/Back-End/YelpCamp
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));   //including method-override
app.use(flash());   //connecting flash to our app 
//at the beginning it will run, after everytime we run the server
//seedDB();   

//PASSPORT CONFIGURATIONS
app.use(require("express-session")({
        secret: "Once again Rusty wins again",
        resave: false,
        saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//in order to make the currentUser avilable on every route with a navbar we use the below function as a middleware instead, to add it manually in every route.
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");//adding the flash messages to every route 
    res.locals.success = req.flash("success");//adding the flash messages to every route 
    next();
});


//This would connect the routes that is required to our app.
//To dry up the code more we can append the routes to the app.use by deleting ("/campground")& make it("/") in the campgrounds file and we append it here in the app.use
app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);//all camground routs starts with /campgrounds
app.use("/campgrounds/:id/comments",commentRoutes);//all comments routes starts with /campgrounds/:id/comments





//Tell Express to listen for request (Start Server)

app.listen(3000, function() { 
    console.log('Yelp Camp And Server listening on port 3000'); 
  });