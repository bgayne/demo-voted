module.exports = (express) => {

  var router = express.Router();
  var User = require('../models/user');
  var Poll = require('../models/poll');
  var bodyparser = require('body-parser');

  router.use(bodyparser.json());
  router.use(bodyparser.urlencoded({extended:true}));
  router.use("/", express.static('./pages/'));

  router.get("/", (req, res) => {
    console.log(req.session, req.session.name)
    if(req.session.user){
      console.log(req.session.user, req.session)
      res.render('html/page-main-authenticated.html', {uname:req.session.user});
    }
    else
      res.status(200).sendFile("pages/html/page-main-unauthenticated.html", {root:'./'});
  });

  return router;
}
