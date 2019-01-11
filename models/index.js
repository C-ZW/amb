'use strict'
const config = require('../config/config');
const Sequelize = require('sequelize');
const sequelize = new Sequelize(config.db,
    config.userName, config.password, config.dbConfig);

const Users = require('./user')(sequelize, Sequelize);
const UserPostHistory = require('./userPostHistory')(sequelize, Sequelize);
const UserCommentHistory = require('./userCommentHistory')(sequelize, Sequelize);
const Posts = require('./post')(sequelize, Sequelize);
const Comments = require('./comment')(sequelize, Sequelize);

Posts.hasMany(Comments, {foreignKey: 'post_id'});
Posts.hasOne(UserPostHistory, { foreignKey: 'post_id' });
UserPostHistory.belongsTo(Posts, {foreignKey: 'post_id'})
Comments.hasOne(UserCommentHistory, { foreignKey: 'comment_id' });
UserCommentHistory.belongsTo(Comments, { foreignKey: 'comment_id' });
Users.hasMany(UserPostHistory, {foreignKey: 'user_id'});
Users.hasMany(UserCommentHistory, {foreignKey: 'user_id'});

module.exports = {
    Users,
    Comments,
    UserCommentHistory,
    UserPostHistory,
    Posts,
    sequelize
}