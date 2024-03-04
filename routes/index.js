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
  const loggedInUser = await userModel.findOne({username:req.session.passport.user}).populate('friends')
  res.render('home',{loggedInUser});
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

router.post('/searchuser', async (req, res, next) => {
  const data = req.body.data;
  console.log(data);

  if (typeof data !== 'string') {
    return res.status(400).json({ error: 'Search data must be a string' });
  }

  try {
    const allUsers = await userModel.find({
      username: {
        $regex: data,
        $options: 'i'
      }
    });

    console.log(allUsers);
    res.status(200).json(allUsers);
  } catch (error) {
    console.error('Error searching users:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/addFriend', isLoggedIn, async (req, res, next) => {
  try {
    const friendId = req.body.friendId;

    const friendUser = await userModel.findOne({
      _id: friendId
    });

    const loggedInUser = await userModel.findOne({
      username: req.session.passport.user
    });

    // Check if the friend is already in the user's friend list
    const isAlreadyFriend = loggedInUser.friends.includes(friendUser._id);
    if (isAlreadyFriend) {
      return res.status(200).json({
        message: 'Already friends'
      });
    }

    // Add friend to the logged in user's friend list
    loggedInUser.friends.push(friendUser._id);

    // Add logged in user to friendUser's friend list
    friendUser.friends.push(loggedInUser._id);

    // Save both users
    await loggedInUser.save();
    await friendUser.save();

    // Redirect to the home page after adding friend
    res.redirect("/home");
  } catch (error) {
    console.error('Error adding friend:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});



module.exports = router;
