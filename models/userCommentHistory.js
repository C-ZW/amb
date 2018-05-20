'use strict'
module.exports = (sequelize, DataTypes) => {
    let userCommentHistory = sequelize.define('userCommentHistory', {
        user_id: {
            type: DataTypes.STRING,
            primaryKey: true
        },
        comment_id: {
            type: DataTypes.UUID,
            primaryKey: true
        }
    });

    userCommentHistory.associate = function (models) {
        
    };

    return userCommentHistory;
}