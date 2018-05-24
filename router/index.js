const router = require('express').Router();
const ENV = process.env.NODE_ENV.trim() || 'dev';

if(ENV === 'dev') {
    router.use(require('./dev'));
} else if (ENV === 'production') {
    router.use(require('./production'));
} else {
    
    throw 'env error';
}

module.exports = router;