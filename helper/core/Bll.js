'use strict'
const signatureSalt = require('../../config/config').signatureSalt;
const signatureGenerator = require('../signature');
const sequelize = require('../../models').sequelize;
const commentSalt = require('../../config/config').commentSalt;

class DB {
    constructor(accessor) {
        this.accessor = accessor;
    }

    getPosts() {
        return this.accessor.getPosts();
    }

    createPost(postId, data, userId) {
        return sequelize.transaction(async (t) => {
            await this.accessor.createPost(userId, postId, data, t);
            await this.accessor.createPostHistory(userId, postId, t);
        })
            .then(() => {
                return 'create success';
            })
            .catch(err => {
                throw 'create post error: ' + err;
            });
    }

    createPostHistory(userId, postId) {
        return this.accessor.createPostHistory(userId, postId);
    }

    getPost(userId, id) {
        let userSignature = signatureGenerator(userId, id, signatureSalt);
        return this.accessor.getPost(id, userSignature);
    }

    async deletePost(userId, postId) {
        if (await this.isPostCreator(userId, postId)) {
            throw ' user is not the post creator';
        }

        return sequelize.transaction(async (t) => {
            await this.accessor.deletePostHistories(userId, postId, t);
            await this.accessor.deleteCommentHistories(null, postId, null, t);
            await this.accessor.deleteComments(null, postId, t);
            await this.accessor.deletePost(postId, t);
        })
            .then(() => {
                return 'delete success post';
            })
            .catch(err => {
                throw 'delete fail: ' + err;
            });
    }

    deleteComments(postId) {
        return sequelize.transaction(async (t) => {
            await this.accessor.deleteComments(null, postId, t);
            await this.accessor.deleteCommentHistories(null, postId, null, t);
        })
            .then(() => {
                return 'delete success';
            })
            .catch((err) => {
                throw 'delete fail: ' + err;
            })
    }

    deleteCommentHistories(postId) {
        return this.accessor.deleteCommentHistories(postId);
    }

    deletePostHistories(userId, postId) {
        return this.accessor.deletePostHistories(userId, postId);
    }

    isPostCreator(userId, postId) {
        return this.accessor.isPostCreator(userId, postId);
    }

    updatePost(postId, title, content, signature) {
        return this.accessor.updatePost(postId, title, content, signature);
    }

    createUser(account, password) {
        return this.accessor.createUser(account, password);
    }

    async getUserHistories(userId) {
        let commentHistories = await this.accessor.getCommentHistories(userId);
        let postHistories = await this.accessor.getPostHistories(userId);
        let result = {};
        result['post'] = postHistories;
        result['commnet'] = commentHistories;
        return result;
    }

    login(account, password) {
        return this.accessor.login(account, password);
    }

    getComments(postId) {
        return this.accessor.getComments(postId);
    }

    createComment(comment, userId) {
        return sequelize.transaction(async (t) => {
            await this.accessor.createComment(comment, t);
            await this.accessor.createCommentHistory(comment, userId, t);
        })
            .then(() => {
                return 'create comment success';
            })
            .catch((err) => {
                throw 'create comment err: ' + err;
            })
    }

    async updateComment(userId, commentId, content) {
        try {
            let postId = await this.accessor.getPostIdByComment(commentId);
            let signature = signatureGenerator(userId, postId, commentSalt);
            let result = await this.accessor.updateComment(commentId, content, signature);

            return result;
        } catch (err) {
            throw 'update comment error: ' + err;
        }
    }

    deleteComment(commentId, userId) {
        return sequelize.transaction(async (t) => {
            await this.accessor.deleteCommentHistories(commentId, null, userId, t);
            await this.accessor.deleteComments(commentId, null, t);
        })
            .then(() => {
                return 'delete comment success';
            })
            .catch(err => {
                throw 'delete comment error: ' + err;
            });
    }

    getComment(commentId) {
        return this.accessor.getComment(commentId);
    }
}

module.exports = DB;