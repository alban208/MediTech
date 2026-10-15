const sequelize = require('../database/config');
const { DataTypes } = require('sequelize');

const Rdv = sequelize.define(
    'Rdv',
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        patient_id: {
            type: DataTypes.INTEGER,
        },
        medecin_id: {
            type: DataTypes.INTEGER,
        },
        start_datetime: {
            type: DataTypes.DATE,
        },
        end_datetime: {
            type: DataTypes.DATE,
        },
        location: {
            type: DataTypes.TEXT('long'),
        },
    }, {
        tableName: 'rdv',
        timestamps: false,
    }
);

module.exports = Rdv;