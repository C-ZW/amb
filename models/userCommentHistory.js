'use strict'
module.exports = (sequelize, DataTypes) => {
    let userCommentHistory = sequelize.define('user_comment_histories', {
        user_id: {
            type: DataTypes.UUID,
            primaryKey: true
        },
        comment_id: {
            type: DataTypes.UUID,
            primaryKey: true
        }
    });

    return userCommentHistory;
}