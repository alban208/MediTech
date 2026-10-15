const sequelize = require('../database/config');
const { DataTypes } = require('sequelize');

const User = sequelize.define(
    'User',
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        prenom: {
            type: DataTypes.STRING(100),
        },
        nom: {
            type: DataTypes.STRING(100),
        },
        email: {
            type: DataTypes.STRING(100),
            unique: true,
        },
        password: {
            type: DataTypes.STRING(245)
        },
        role: {
            type: DataTypes.ENUM(["PATIENT", "MEDECIN", "ADMIN"]),
        },
    }, {
        tableName: 'users',
        timestamps: false,
    }
);

module.exports = User; 