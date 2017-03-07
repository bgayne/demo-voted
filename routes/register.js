module.exports = (express) => {
  var router = express.Router();
  var session = require('express-session');
  var bodyparser = require('body-parser');
  var User = require('../models/user');

  router.use(bodyparser.json());
  router.use(bodyparser.urlencoded({extended:true}));
  router.use("/", express.static('./pages/'));

  router.get("/", (req, res) => {
    res.status(200).sendFile("/pages/html/page-register.html", {root:'./'});
  });

  router.post("/", (req, res) => {
    console.log(req.body);
    User.find({username:req.body.username}, (err, uname) => {
      if(uname[0] !== undefined) res.send({status:"error", message:"username taken"});
      else User.getLatestUUID((err, user) => {
        User.newUser(err, user, req, (err, newUser) => {
          req.session.user = newUser.username;
          res.send({status:"success", message:"user created"});
        });
      });
    });
  });
  return router
}
