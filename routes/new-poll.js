module.exports = (express) => {

  var router = express.Router();
  var User = require('../models/user');
  var Poll = require('../models/poll');
  var bodyparser = require('body-parser');
  var sha1 = require('sha1');

  router.use(bodyparser.json());
  router.use(bodyparser.urlencoded({extended:true}));
  router.use("/", express.static('./pages/'));

  function formatOptions(options) {
    var formattedOptions = [];
    for(var i in options) {
      formattedOptions.push({
        optionName:options[i],
        votes: 0
      })
    }
    return formattedOptions;
  }

  router.get("/", (req, res) => {
    console.log(req.session, req.session.name)
    if(req.session.user){
      console.log(req.session.user, req.session)
      res.render('html/page-new-poll.html', {uname:req.session.user});
    }
    else
      res.render("html/page-login.html", {URL:"/polls/new"});
  });

  router.post("/", (req, res) => {
    if(req.session.user) {
      User.getUserByName(req.session.user, (err, user) => {
        Poll.getLatestID((err,poll) => {
          Poll.create({
            ownerID:user[0].uuid,
            pollID:(poll[0] !== undefined) ? poll[0].pollID + 1 : 0,
            title:req.body.title,
            url:sha1(req.body.title  + user[0].uuid + ((new Date().getTime()) / 1000)),
            options:formatOptions(req.body.options)
          }, (err, newPoll) => {
            if(newPoll) {
              user[0].polls.push(newPoll.pollID);
              user[0].save();
              res.send({status:"success", message:"poll created", id:newPoll.url});
            }
            else
              res.send({status:"error", message:"poll error"})});
        })
      });
    }
  });
  return router;
}
