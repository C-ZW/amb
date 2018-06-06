const router = require('express').Router();
const register = require('./register');
const login = require('./login');
const post = require('./post');
const auth = require('./auth');
const userHistory = require('./userHistory');

router.use(register);
router.use(login);
// router.use(auth);
router.use(post);
router.use(userHistory);



module.exports = router;