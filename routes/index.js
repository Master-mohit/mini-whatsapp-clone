var express = require('express');
var router = express.Router();
const userModel = require("./users");
const messageModel = require("./message");
const passport = require("passport");
const localstregy = require("passport-local"); // pass or username se bases me account bna ske..
const users = require('./users');

passport.use(new localstregy(userModel.authenticate()));  //logdin kr rhe ho pass or username ke basic me ...

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/home', function(req, res, next) {
  const userLogdin = req.user  //logdin user 
  res.render('home', {userLogdin})
});


router.post("/register", function(req, res, next){
  const userData = new userModel({
   username: req.body.username,
   email: req.body.email,
  });
  userModel.register(userData, req.body.password)
  .then ((result)=> {
    passport.authenticate("local")(req, res, ()=> {
      res.redirect("/home")
     
      
    })
  })
  .catch((err)=> {
   res.send(err);
  });
});

router.get('/login', function(req, res, next) {
  res.render('login');
  
});

router.post('/login', passport.authenticate("local", {//username or pass. ke baisc me login kroo..
  successRedirect: "/home", //agr si data ho to use home route me bhej dena.
  failureRedirect: "/login"
 }), (req, res, next) => { 
   
 });
 
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

 function isLoggedIn(req, res, next){
  if(req.isAuthenticated()) return next();
  res.redirect("/login")
 }

router.post("/searchUser", isLoggedIn, async function(req, res,next) {
const data = req.body.data  
res.send(req.body.data)
const allUsers = await userModel.find({
  username: {
    $regex: data,
    $options: 'i'
  }
})
console.log(allUsers);
res.status(200).json(allUsers)

});

module.exports = router;
