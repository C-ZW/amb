const crypro = require('crypto');

function hashing(plaintext, salt='') {
    let result = crypro.createHmac('sha256', salt)
        .update(`${plaintext}${salt}`)
        .digest('hex');
    return result;
}

module.exports = hashing;