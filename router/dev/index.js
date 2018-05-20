const router = require('express').Router();
const post = require('./post');
const userPostHistory = require('./userPostHistory');

router.use(post);
router.use(userPostHistory);

module.exports = router;