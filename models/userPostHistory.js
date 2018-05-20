'use strict'
module.exports = (sequelize, DataTypes) => {
    let userPostHistory = sequelize.define('userPostHistory', {
        user_id: {
            type: DataTypes.STRING,
            primaryKey: true
        },
        post_id: {
            type: DataTypes.UUID,
            primaryKey: true
        }
    });

    userPostHistory.associate = function (models) {
        
    };

    return userPostHistory;
}