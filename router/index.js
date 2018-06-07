const router = require('express').Router();
const register = require('./register');
const login = require('./login');
const post = require('./post');
const auth = require('./auth');
const userHistory = require('./userHistory');
const comment = require('./comment');

router.use(register);
router.use(login);
router.use(auth);
router.use(post);
router.use(userHistory);
router.use(comment)



module.exports = router;