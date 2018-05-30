'use strict'
module.exports = (sequelize, DataTypes) => {
    let userPostHistory = sequelize.define('user_post_histories', {
        user_id: {
            type: DataTypes.UUID,
            primaryKey: true
        },
        post_id: {
            type: DataTypes.UUID,
            primaryKey: true
        }
    });

    return userPostHistory;
}