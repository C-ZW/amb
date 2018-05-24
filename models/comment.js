'use strict'
module.exports = (sequelize, DataTypes) => {
    let comment = sequelize.define('comment', {
        comment_id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.literal('uuid_generate_v4()')
        },
        post_id: DataTypes.UUID,
        content: DataTypes.STRING,
        created_time: DataTypes.DATE,
        signature: DataTypes.UUID
    });

    return comment;
}