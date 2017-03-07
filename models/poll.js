var mongoose = require('mongoose');
var sha1 = require('sha1');

var pollSchema = new mongoose.Schema({
  ownerID:Number,
  pollID:Number,
  title:String,
  url:String,
  options:[{
    optionName:String,
    votes:Number
  }]
});

pollSchema.statics.findPollByURL = function(URL, cb) {
  return this.model('Polls').find({url:URL}).limit(1).exec(cb);
}

pollSchema.statics.getPollsByUserID = function(ID, cb) {
  return this.model('Polls').find({ownerID:ID}).exec(cb);
}

pollSchema.statics.getLatestID = function(cb) {
  return this.model('Polls').find().sort('-pollID').limit(1).exec(cb);
}

pollSchema.static.newestPolls = function(cb) {
  return this.model('Polls').find().sort('-pollID').limit(5).exec(cb);
}


module.exports = mongoose.model('Polls', pollSchema);
