const config = require('../config/config');
const Sequelize = require('sequelize');
const sequelize = new Sequelize(config.db,
    config.userName, config.password, config.dbConfig);

const Users = require('./user')(sequelize, Sequelize);
const UserPostHistory = require('./userPostHistory')(sequelize, Sequelize);
const UserCommentHistory = require('./userCommentHistory')(sequelize, Sequelize);
const Posts = require('./post')(sequelize, Sequelize);
const Comments = require('./comment')(sequelize, Sequelize);

Posts.hasMany(Comments);
Posts.hasOne(UserPostHistory);
Comments.hasOne(UserCommentHistory);
Users.hasMany(UserPostHistory);
Users.hasMany(UserCommentHistory);

module.exports = {
    Users,
    Comments,
    UserCommentHistory,
    UserPostHistory,
    Posts,
    sequelize
}