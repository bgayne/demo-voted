module.exports = (express) => {
  var router = express.Router();

  router.get('/', (req, res) => {
    req.session.destroy();
    res.redirect('../')
  });

  return router;
}
