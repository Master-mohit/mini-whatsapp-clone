// Import necessary modules
const express = require('express');
const router = express.Router();
const userModel = require("./users");
const passport = require("passport");
const localStrategy = require("passport-local");

// Configure passport local strategy
passport.use(new localStrategy(userModel.authenticate()));




// GET home page route
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});



// POST register route
router.post("/register", function(req, res, next){
  const userData = new userModel({
    username: req.body.username,
    email: req.body.email,
  });
  userModel.register(userData, req.body.password)
    .then((result)=> {
      passport.authenticate("local")(req, res, ()=> {
        res.redirect("/home");
      });
    })
    .catch((err)=> {
      res.send(err);
    });
});

// GET login page route
router.get('/login', function(req, res, next) {
  res.render('login');
});

router.get('/home', isLoggedIn ,async function(req, res) { 
  const user = await userModel.findOne({username:req.session.passport.user}).populate('friend')
  res.render('home',{user});
});
// POST login route
router.post('/login', passport.authenticate("local", {
  successRedirect: "/home",
  failureRedirect: "/login"
}));

// GET logout route
router.get('/logout', (req, res, next) => {
  if (req.isAuthenticated())
    req.logout((err) => {
      if (err) res.send(err);
      else res.redirect('/');
    });
  else {
    res.redirect('/');
  }
});

// Middleware to check if user is authenticated
function isLoggedIn(req, res, next){
  if(req.isAuthenticated()) return next();
  res.redirect("/login");
}




module.exports = router;
