'use strict'
module.exports = (sequelize, DataTypes) => {
    let user = sequelize.define('users', {
        user_id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.literal('uuid_generate_v4()')
        },
        account: DataTypes.STRING,
        password: DataTypes.STRING
    });

    return user;
}