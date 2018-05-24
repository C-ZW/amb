const config = require('../config/config');
const Sequelize = require('sequelize');
const sequelize = new Sequelize(config.db,
    config.userName, config.password, config.dbConfig);

const Users = require('./user')(sequelize, Sequelize);
const UserPostHistory = require('./userPostHistory')(sequelize, Sequelize);
const UserCommentHistory = require('./userCommentHistory')(sequelize, Sequelize);
const Posts = require('./post')(sequelize, Sequelize);
const Comments = require('./comment')(sequelize, Sequelize);
const Categorical = require('./categorical')(sequelize, Sequelize);

Posts.hasMany(Comments);
Posts.hasOne(UserPostHistory);
Posts.hasMany(Categorical);

// Categorical.belongsTo(Posts);

// Comments.belongsTo(Posts);
Comments.hasOne(UserCommentHistory);

// UserPostHistory.belongsTo(Posts);

// UserCommentHistory.belongsTo(Comments);

Users.hasMany(UserPostHistory);
Users.hasMany(UserCommentHistory);

// Comments.create({
//     post_id: '8ab6758e-2cb6-4cbf-857c-fcabfa5470a4',
//     content: 'content test',
//     created_time: new Date(),
//     signature: 'signature test'
// })

// UserCommentHistory.create({
//     user_id: '28e22b97-d4c6-48fc-a087-192fc71ca878',
//     comment_id: '7fce2e41-ecbe-406c-a6a2-37f8904cf915'
// })
// .catch(Sequelize.ValidationError, function (msg) {
//     console.log(msg.name)
//     console.log(msg.name === 'SequelizeUniqueConstraintError')
// })
// Users.findAll({ raw: true })
//     .then((data) => {
//         console.log(data)
//     })
// Users.sync().then(() => {
//     Users.create({
//         account: 'test',
//         password: 'DataTypes.STRING'
//     })
// })
// Users.create({
//     account: 'test2',
//     password: 'DataTypes.STRING'
// })
// Posts.create({
//     title: 'title test',
//     content: 'DataTypes.STRING',
//     created_time: new Date(),
//     like: 20,
//     dislike: 30,
//     popularity: 50
// });

module.exports = {
    Users,
    Comments,
    UserCommentHistory,
    UserPostHistory,
    Posts,
    Categorical
}