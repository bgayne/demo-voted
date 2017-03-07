module.exports = (express) => {

  var router = express.Router();
  var User = require('../models/user');
  var Poll = require('../models/poll');
  var bodyparser = require('body-parser');


  var pollOptionItemString = "\
  <div class=\"col-xs-12\">\
    <input type=\"radio\" name=\"poll-options\" value=\"{i}\" id=\"option-{i}\" class=\"radio-option-button\"/>\
    <label for=\"option-{i}\" class=\"radio-option-{i} radio-option-text form-group\">{optionText}</label>\
  </div>\
  "

  function renderChoices (options) {
    var renderedOptions = "";
    for(var i = 0; i < options.length; i++)
      renderedOptions += (pollOptionItemString.replace(/{i}/g, ""+(i+1))).replace(/{optionText}/, options[i].optionName);
    return renderedOptions;
  }

  router.use(bodyparser.json());
  router.use(bodyparser.urlencoded({extended:true}));
  router.use("/", express.static('./pages/'));
  router.use("/:id/results", express.static('./pages/'))

  router.get("/", (req, res) => {
    res.redirect("../polls/new");
  });

  router.get("/:id", (req, res) => {
      Poll.findPollByURL(req.params.id, (err, poll) => {
        console.log(req.params.id, poll, poll[0]);
        if(req.session.user)
          res.render('html/page-poll.html', {title:poll[0].title, uname:req.session.user, pid:req.params.id, pollOptions:renderChoices(poll[0].options)})
        else
          res.render("html/page-login.html", {URL:"/polls/"+poll[0].url});
      })
  })

  router.get('/:id/results', (req, res) => {
    Poll.findPollByURL(req.params.id, (err, poll) => {
      if(req.session.user !== undefined) {
        res.render('partials/nav-auth.html', {uname:req.session.user}, (err, navbar) => {
          res.render('html/page-results.html', {nav:navbar, pid:req.params.id, title:poll[0].title});
        })
      }
      else
        res.render('partials/nav-unauth.html', {}, (err, navbar) => {
          res.render('html/page-results.html', {nav:navbar, pid:req.params.id, title:poll[0].title});
        })
    })
  })

  router.post('/:id', (req, res) => {
    if(req.session.user === undefined)
      res.send({status:"error", message:"user is not logged in"});
    else
      Poll.findPollByURL(req.params.id, (err, poll) => {
        if(poll[0]){
          poll = poll[0];
          User.getUserByName(req.session.user, (err, user) => {
            var index = ""+req.params.id;
            if(user[0].history[index] === undefined) {
              //Basically a hashmap.
              //If the user has the poll ID in their history object,
              //which is indexed by its name,
              //then we know that they've voted in a poll before.
              poll.options[req.body.selection - 1].votes++;
              user[0].history.set(index, "");
              user[0].save();
              poll.save();
              res.send({status:"success", message:"vote submitted successfully"});
            }
            else
              res.send({status:"error", message:"user has already voted in this poll"});
          })
        }
      })
  })

  router.post('/:id/results', (req, res) => {
    Poll.findPollByURL(req.params.id, (err, poll) => {
      User.findByID(poll[0].ownerID, (err, user) => {
        res.send({
          title:poll[0].title,
          username:user[0].username,
          options:poll[0].options
        });
      })
    })
  })




  return router;
}
