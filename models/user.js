'use strict'
module.exports = (sequelize, DataTypes) => {
    let user = sequelize.define('user', {
        user_id: {
            type: DataTypes.STRING,
            primaryKey: true
        },
        passwork: DataTypes.STRING
    });

    user.associate = function (models) {
        
    };

    return user;
}