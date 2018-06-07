const hash = require('./hashing')

function signatureGenerator(userId, id, salt) {
    if(userId === undefined) {
        throw 'user is undefined';
    }

    if(id === undefined) {
        throw 'id is undefined';
    }

    if(salt === undefined) {
        throw 'salt is undeined';
    }

    return hash(`${userId}${id}${salt}`);
}

module.exports = signatureGenerator;