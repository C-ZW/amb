const router = require('express').Router();
const register = require('./register');
const login = require('./login');
const post = require('./post');

router.use(register);
router.use(login);
router.use(post);


module.exports = router;