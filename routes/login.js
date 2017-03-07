module.exports = (express) => {
  var router = express.Router();
  var User = require('../models/user');
  var bodyparser = require('body-parser');

  router.use(bodyparser.json());
  router.use(bodyparser.urlencoded({extended:true}));
  router.use("/", express.static('./pages/'));

  router.get("/", (req, res) => {
    if(req.session.user){
      console.log(req.session.user)
      res.redirect('../');
    }
    else
      res.status(200).render("html/page-login.html", {URL:"/"});
  });

  router.post("/", (req, res) => {
    User.find({username:req.body.username}).limit(1).exec((err, user) => {
      if(user === undefined) res.send({error:"User Not Found"});
      else {
        if(req.session.user === undefined) {
          req.session.user = user[0].username;
          req.session.save();
        }
        res.send({status:302})
      }
    })
  });

  return router;
}
