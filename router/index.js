const router = require('express').Router();
const register = require('./register');
const login = require('./login');
const post = require('./post');
const auth = require('./auth');

router.use(register);
router.use(login);
router.use(auth);
router.use(post);



module.exports = router;