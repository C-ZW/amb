const models = require('../models');
const template = require('./template');
const Sequelize = require('sequelize');
const signatureSalt = require('../config/config').signatureSalt;
const signatureGenerator = require('./signature');

class DB {
    constructor(db) {
        this.db = db;
    }

    async getPosts() {
        return models.Posts.findAll({
            limit: 100,
            order: [['created_time', 'DESC']],
            raw: true
        })
            .then((posts) => {
                return posts.map(template.commonUserView)
            })
            .catch(err => {
                return err;
            });
    }

    async createPost(postId, data, userId) {
        console.log(template.postTemplate(postId, data, userId))
        return models.Posts.create(template.postTemplate(postId, data, userId))
            .then(async () => {
                await this.createHistory(userId, postId);
            })
            .catch(Sequelize.ValidationError, (err) => {
                return `create post validation error: ${err}`;
            })
            .catch((err) => {
                return `create post error: ${err}`;
            });
    }

    async createHistory(userId, postId) {
        return models.UserPostHistory.create({
            user_id: userId,
            post_id: postId,
            preference_type: 'creator'
        })
            .then((data) => {
                return data;
            })
            .catch((err) => {
                return err;
            });
    }

    async getPost(userId, id) {
        let userSignature = signatureGenerator(userId, id, signatureSalt);
        return models.Posts.findOne({
            where: {
                post_id: id
            }
        })
            .then((data) => {
                if (data === null) {
                    throw 'no found ' + id;
                }

                if (data.signature === userSignature) {
                    return template.creatorView(data);
                } else {
                    return template.commonUserView(data);
                }
            })
            .catch((err) => {
                console.log('test' + err)
                return 'get post error: ' + err;
            });
    }
}



module.exports = new DB();