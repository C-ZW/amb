const router = require('express').Router();
const register = require('./register');
const login = require('./login');

router.use(register);
router.use(login);



module.exports = router;