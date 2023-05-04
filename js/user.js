var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var user = new mongoose.Schema({
  userID: String,
  guild: String,

  soglashenie:{typs:Boolean, default:false},
  names:String,
  sex:String,
  age:String,
  status:String,
  photo:String,
  likes:[],
  vising:[],
  intresting:String
  
});

module.exports = mongoose.model("user", user);