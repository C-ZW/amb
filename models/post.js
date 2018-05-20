'use strict'
module.exports = (sequelize, DataTypes) => {
    let post = sequelize.define('post', {
        post_id: {
            type: DataTypes.UUID,
            primaryKey: true
        },
        title: DataTypes.STRING,
        content: DataTypes.STRING,
        created_time: DataTypes.DATE,
        like: DataTypes.BIGINT,
        dislike: DataTypes.BIGINT,
        popularity: DataTypes.BIGINT
    });

    post.associate = function (models) {
        
    };

    return post;
}