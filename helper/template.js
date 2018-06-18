'use strict'
const validator = require('validator');
const chai = require('chai');
const signatureGenerator = require('./signature')
const signatureSalt = require('../config/config').signatureSalt

function postTemplate(postId, post, userId) {
    chai.should().exist(postId, 'postId id shoud exist');
    chai.should().exist(post, 'post id shoud exist');
    chai.should().exist(userId, 'userId id shoud exist');

    return {
        post_id: postId,
        title: validator.escape(post.title),
        content: validator.escape(post.content),
        created_time: validator.toDate(post.created_time),
        signature: signatureGenerator(userId, postId, signatureSalt)
    }
}
function commonUserView(post) {
    return {
        post_id: post.post_id,
        title: validator.unescape(post.title),
        content: validator.unescape(post.content),
        created_time: post.created_time
    }
}

function creatorView(post) {
    return {
        post_id: post.post_id,
        title: validator.unescape(post.title),
        content: validator.unescape(post.content),
        created_time: post.created_time,
        like: post.like,
        dislike: post.dislike,
        popularity: post.popularity
    }
}

function updatePostTemplate(title, content) {
    let toUpdate = {};
    if (title !== undefined) {
        toUpdate.title = validator.escape(title);
    }

    if (content !== undefined) {
        toUpdate.content = validator.escape(content);
    }
    return toUpdate;
}

module.exports = {
    postTemplate,
    commonUserView,
    creatorView,
    updatePostTemplate
}