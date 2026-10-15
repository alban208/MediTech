const sequelize = require('../database/config');
const { DataTypes } = require('sequelize');

const Medecin = sequelize.define(
    'Medecin',
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        user_id: {
            type: DataTypes.INTEGER,
        },
        specialite_id: {
            type: DataTypes.INTEGER,
        },
        location: {
            type: DataTypes.TEXT('long'),
        },
    }, {
        tableName: 'medecins',
        timestamps: false,
    }
);


module.exports = Medecin; 