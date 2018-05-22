const router = require('express').Router();
const post = require('./post');
const userPostHistory = require('./userPostHistory');
const userCommentHistory = require('./userCommentHistory');
const comment = require('./comment');

router.use(post);
router.use(userPostHistory);
router.use(userCommentHistory);
router.use(comment);

module.exports = router;