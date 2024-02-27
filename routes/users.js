const mongoose = require("mongoose");
const plm = require("passport-local-mongoose");
mongoose.connect('mongodb://0.0.0.0/miniwhatsapp')

const userSchema = mongoose.Schema({
username: String,
password: String,
email: String,
profileImage: {
  type: String,
  default: "https://plus.unsplash.com/premium_photo-1697232652942-5b43191a4015?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw3fHx8ZW58MHx8fHx8"
},
socketId: String, 

friend:[{ 
  type:mongoose.Schema.Types.ObjectId , 
  ref:"user"
}]
});
userSchema.plugin(plm);
module.exports = mongoose.model("user", userSchema);