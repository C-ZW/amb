'use strict'
module.exports = (sequelize, DataTypes) => {
    let categorical = sequelize.define('comment', {
        post_id: {
            type: DataTypes.UUID,
            primaryKey: true
        },
        topic: {
            type: DataTypes.STRING,
            primaryKey: true
        }
    });

    return categorical;
}