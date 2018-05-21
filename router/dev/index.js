const router = require('express').Router();
const post = require('./post');
const userPostHistory = require('./userPostHistory');
const comment = require('./comment');

router.use(post);
router.use(userPostHistory);
router.use(comment);

module.exports = router;