import express from 'express';
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, _next) {
  res.render('index', { title: 'Express' });
});

export default router;
