const models = require('../models');
const template = require('./template');
const Sequelize = require('sequelize');
const signatureSalt = require('../config/config').signatureSalt;
const signatureGenerator = require('./signature');
const sequelize = require('../models').sequelize;
const validator = require('validator');
const commentSalt = require('../config/config').commentSalt;

class DB {
    constructor(db) {
        this.db = db;
    }

    getPosts() {
        return _getPosts();
    }

    createPost(postId, data, userId) {
        return sequelize.transaction(async (t) => {
            await _createPost(userId, postId, data, t);
            await _createPostHistory(userId, postId, t);
        })
            .then(() => {
                return 'create success';
            })
            .catch(err => {
                throw 'create post error: ' + err;
            });
    }

    createPostHistory(userId, postId) {
        return _createPostHistory(userId, postId);
    }

    getPost(userId, id) {
        let userSignature = signatureGenerator(userId, id, signatureSalt);
        return _getPost(id, userSignature);
    }

    async deletePost(userId, postId) {
        if (await this.isPostCreator(userId, postId)) {
            throw ' user is not the post creator';
        }

        return sequelize.transaction(async (t) => {
            await _deletePostHistories(userId, postId, t);
            await _deleteCommentHistories(postId, t);
            await _deleteComments(postId, t);
            await _deletePost(postId, t);
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
            await _deleteComments(null, postId, t);
            await _deleteCommentHistories(null, postId, null, t);
        })
            .then(() => {
                return 'delete success';
            })
            .catch((err) => {
                throw 'delete fail: ' + err;
            })
    }

    deleteCommentHistories(postId) {
        return _deleteCommentHistories(postId);
    }

    deletePostHistories(userId, postId) {
        return _deletePostHistories(userId, postId);
    }

    isPostCreator(userId, postId) {
        return _isPostCreator(userId, postId);
    }

    updatePost(postId, title, content, signature) {
        return _updatePost(postId, title, content, signature);
    }

    createUser(account, password) {
        return _createUser(account, password);
    }

    async getUserHistories(userId) {
        let commentHistories = await _getCommentHistories(userId)
        let postHistories = await _getPostHistories(userId);
        let result = {};
        postTemplate(result, postHistories);
        commentTemplate(result, commentHistories);
        return result;
    }

    login(account, password) {
        return _login(account, password);
    }

    getComments(postId) {
        return _getComments(postId);
    }

    createComment(comment, userId) {
        return sequelize.transaction(async (t) => {
            await _createComment(comment, t);
            await _createCommentHistory(comment, userId, t);
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
            let postId = await _getPostIdByComment(commentId);
            let signature = signatureGenerator(userId, postId, commentSalt);
            let result = await _updateComment(commentId, content, signature);

            return result;
        } catch (err) {
            throw 'update comment error: ' + err;
        }
    }

    deleteComment(commentId, userId) {
        return sequelize.transaction(async (t) => {
            await _deleteCommentHistories(commentId, null, userId, t);
            await _deleteComments(commentId, null, t);
        })
            .then(() => {
                return 'delete comment success';
            })
            .catch(err => {
                throw 'delete comment error: ' + err;
            });
    }

    getComment(commentId) {
        return _getComment(commentId);
    }
}

function _getComment(commentId) {
    return models.Comments.findOne({
        attributes: ['post_id', 'content', 'created_time'],
        where: {
            comment_id: commentId
        },
        raw: true
    })
        .then((data) => {
            if(data === null) {
                throw ' comment no found';
            }
            return data;
        })
        .catch((err) => {
            throw ' get comment error' + err;
        });
}

function _getPostIdByComment(id, t) {
    return models.Comments.findOne({
        attributes: [
            'post_id'
        ],
        where: {
            comment_id: id
        },
        transaction: t,
        raw: true
    })
        .then((data) => {
            if (data !== null) {
                return data.post_id;
            } else {
                throw 'can not find post id by comment id';
            }
        })
        .catch(err => {
            throw 'get post by comment error: ' + err;
        });
}

function _updateComment(commentId, content, signature, t) {
    return models.Comments.update({
        content: content
    }, {
            where: {
                comment_id: commentId,
                signature: signature
            },
            transaction: t
        })
        .then((data) => {
            if (data[0] === 0) {
                throw 'check comment id or user id';
            }
            return 'upadte comment success';
        })
        .catch((err) => {
            throw 'update comment error: ' + err;
        })
}

function _createComment(comment, t) {
    return models.Comments.create(comment, {
        transaction: t
    })
        .then(() => {
            return 'create comment success';
        })
        .catch((err) => {
            throw 'create comment error: ' + err;
        });
}

function _createCommentHistory(comment, userId, t) {
    return models.UserCommentHistory.create({
        comment_id: comment.comment_id,
        user_id: userId,
        post_id: comment.post_id
    }, {
            transaction: t
        })
        .then(() => {
            return 'create comment history success';
        })
        .catch((err) => {
            throw 'create comment history err: ' + err;
        });
}

function _getComments(postId) {
    return models.Comments.findAll({
        attributes: ['comment_id', 'content', 'created_time', 'signature'],
        order: [['created_time', 'DESC']],
        where: {
            post_id: postId
        }
    })
        .then((data) => {
            return data;
        })
        .catch((err) => {
            throw 'get comments error: ' + err;
        });
}

function _login(account, password) {
    return models.Users.findOne({
        attributes: ['user_id'],
        where: {
            account: account,
            password: password
        },
        raw: true
    }
    )
        .then((data) => {
            return data.user_id;
        })
        .catch((err) => {
            throw 'login error: ' + err;
        });
}

function _getPostHistories(userId, t) {
    return models.UserPostHistory.findAll({
        attributes: ['post_id'],
        include: [{ model: models.Posts }],
        where: {
            user_id: userId
        },
        transaction: t
    })
        .then((data) => {
            return data
        })
        .catch(err => {
            throw 'get post histories error: ' + err;
        });
}

function _getCommentHistories(userId, t) {
    return models.UserCommentHistory.findAll({
        attributes: ['comment_id'],
        include: [{ model: models.Comments }],
        where: {
            user_id: userId
        },
        transaction: t
    })
        .then(data => {
            return data;
        })
        .catch(err => {
            throw 'get comment histories error: ' + err;
        });
}

function postTemplate(container, posts) {
    container.post = [];
    for (let i of posts) {
        container.post.push(i.post);
    }
    return container;
}

function commentTemplate(container, comments) {
    container.comment = [];

    for (let i of comments) {
        container.comment.push(i.comment);
    }
    return container;
}

function _createUser(account, password, t) {
    return models.Users.create({
        account: account,
        password: password
    }, {
            transaction: t
        }
    )
        .then(() => {
            return 'register success';
        })
        .catch(Sequelize.ValidationError, function (msg) {
            throw 'Account already existed.';
        })
        .catch((err) => {
            throw 'register error: ' + err;
        });
}

function _updatePost(postId, title, content, signature, t) {
    return models.Posts.update(updatePostTemplate(title, content), {
        where: {
            post_id: postId,
            signature: signature
        },
        transaction: t
    })
        .then((data) => {
            if (data[0] === 0) {
                throw 'check user id or post id'
            }
            return 'update success';
        })
        .catch((err) => {
            throw 'update post error: ' + err;
        });
}

function _isPostCreator(userId, postId, t) {
    return models.Posts.findOne({
        where: {
            post_id: postId,
            signature: signatureGenerator(userId, postId, signatureSalt)
        },
        raw: true,
        transaction: t
    })
        .then(data => {
            return data === null;
        })
        .catch(err => {
            throw err;
        });
}

function _getPosts() {
    return models.Posts.findAll({
        limit: 100,
        order: [['created_time', 'DESC']],
        raw: true
    })
        .then((posts) => {
            return posts.map(template.commonUserView)
        })
        .catch(err => {
            return 'get posts error ' + err;
        });
}

function _createPostHistory(userId, postId, t) {
    return models.UserPostHistory.create({
        user_id: userId,
        post_id: postId,
        preference_type: 'creator'
    }, {
            transaction: t
        })
        .then((data) => {
            return data;
        })
        .catch((err) => {
            throw 'create post history error: ' + err;
        });
}

function _getPost(id, signature, t) {
    return models.Posts.findOne({
        where: {
            post_id: id
        },
        transaction: t
    })
        .then((data) => {
            if (data === null) {
                throw 'post id error';
            }

            if (data.signature === signature) {
                return template.creatorView(data);
            } else {
                return template.commonUserView(data);
            }
        })
        .catch((err) => {
            throw 'get post error: ' + err;
        });
}

function _createPost(userId, postId, post, t) {
    return models.Posts.create({
        post_id: postId,
        title: validator.escape(post.title),
        content: validator.escape(post.content),
        created_time: validator.toDate(post.created_time),
        signature: signatureGenerator(userId, postId, signatureSalt)
    }, {
            transaction: t
        })
        .catch(Sequelize.ValidationError, (err) => {
            throw `create post validation error: ${err}`;
        })
        .catch((err) => {
            throw `create post error: ${err}`;
        });
}

function _deleteComments(commentId, postId, t) {
    let condition = {};
    if (commentId !== undefined && commentId !== null) {
        condition.comment_id = commentId;
    }

    if (postId !== undefined && postId !== null) {
        condition.post_id = postId;
    }

    return models.Comments.destroy({
        where: condition,
        transaction: t
    })
        .catch(err => {
            throw 'delete comment err: ' + err;
        });
}

function _deleteCommentHistories(commentId, postId, userId, t) {
    let condition = {};
    if (commentId !== undefined && commentId !== null) {
        condition.comment_id = commentId;
    }

    if (postId !== undefined && postId !== null) {
        condition.post_id = postId
    }

    if (userId !== undefined && userId !== null) {
        condition.user_id = userId;
    }

    return models.UserCommentHistory.destroy({
        where: condition,
        transaction: t
    })
        .then((data) => {
            if(data === 0) {
                throw 'comment history no found';
            }
            return data;
        })
        .catch(err => {
            throw 'delete comment histories error: ' + err;
        });
}

function _deletePostHistories(userId, postId, t) {
    return models.UserPostHistory.destroy({
        where: {
            user_id: userId,
            post_id: postId
        },
        transaction: t
    })
        .catch(err => {
            throw 'delete post histories err: ' + err;
        });
}

function _deletePost(postId, t) {
    return models.Posts.destroy({
        where: {
            post_id: postId
        },
        transaction: t
    })
        .then((data) => {
            if (data === 0) {
                throw 'to be deleted post no found';
            }
        })
        .catch((err) => {
            throw 'delete post err: ' + err;
        });
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

module.exports = new DB();