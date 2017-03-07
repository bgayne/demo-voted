var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
  uuid:Number,
  username:String,
  password:String,
  firstName:String,
  lastName:String,
  email:String,
  polls:[Number],
  history:{String}
});


userSchema.statics.getUserByName = function(uname, cb) {
  return this.model('User').find({username:uname}).exec(cb);
}

userSchema.statics.findByID = function(id, cb) {
  return this.model('User').find({uuid:id}).exec(cb);
}

userSchema.statics.newUser = function(err, user, req, cb) {
  if(user[0] === undefined) user[0] = {uuid:-1};
  return this.model('User').create({
    uuid:user[0].uuid+1,
    username:req.body.username,
    password:req.body.password,
    firstName:req.body.firstName,
    lastName:req.body.lastName,
    email:req.body.email,
    polls:[]
  }, cb);
}

userSchema.statics.getLatestUUID = function(cb) {
  return this.model('User').find().sort('-uuid').limit(1).exec(cb);
}

module.exports = mongoose.model('User', userSchema);
