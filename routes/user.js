module.exports = (express) => {

  var router = express.Router();
  var User = require('../models/user');
  var Poll = require('../models/poll');
  var bodyparser = require('body-parser');

  router.use(bodyparser.json());
  router.use(bodyparser.urlencoded({extended:true}));
  router.use("/", express.static('./pages/'));

  router.get("/", (req, res) => {
    console.log(req.session, req.session.user)
    if(req.session.user !== undefined){
      console.log(req.session.user, req.session)
      res.render('partials/nav-auth.html', {uname:req.session.user}, (err, navbar) => {
        console.log(err, navbar);
        res.render('html/page-user.html', {nav:navbar});
      })
    }
    else
      res.status(200).sendFile("pages/html/page-main-unauthenticated.html", {root:'./'});
  });

  router.post("/", (req, res) => {
      if(req.session.user === undefined)
        res.send({status:"error", message:"user must be signed in"});
      else {
        User.getUserByName(req.session.user, (err, user) => {
          Poll.getPollsByUserID(user[0].uuid, (err, polls) => {
            if(polls[0] !== undefined) {
              res.send({status:"success", polls:polls});
            }
            else res.send({status:"error", message:"no polls found"});
          })
        })
      }
  });

  router.delete("/", (req, res) => {
    Poll.findPollByURL(req.body.pollURL, (err, poll) => {
      console.log(err, poll);
      if(poll[0] !== undefined) {
        User.getUserByName(req.session.user, (err, user) => {
          console.log(err, user);
          if(user[0] !== undefined && user[0].uuid === poll[0].ownerID) {
            Poll.remove({url:req.body.pollURL}, (err, rm) => {
              console.log(err, rm);
              res.send({status:"success", message:"poll deleted"});
            })
          }
          else
            res.send({status:"error", message:"poll owner does not exist or cannot be reached"});
        })
      }
    })
  })

  return router;
}
