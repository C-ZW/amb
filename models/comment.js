'use strict'
module.exports = (sequelize, DataTypes) => {
    let comment = sequelize.define('comment', {
        comment_id: DataTypes.UUID,
        post_id: DataTypes.UUID,
        content: DataTypes.STRING,
        created_time: DataTypes.DATE
        // todo:
        // define sequence_number 
        // which is identify the same user in a post
    });

    comment.associate = function (models) {
        models.comment.belongsTo(models.post, {
            onDelete: "CASCADE",
            foreignKey: {
                allowNull: false
            }
        });
    };

    return comment;
}