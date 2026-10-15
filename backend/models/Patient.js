const sequelize = require('../database/config');
const { DataTypes } = require('sequelize');

const Patient = sequelize.define(
    'Patient',
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        user_id: {
            type: DataTypes.INTEGER,
        }
    }, {
        tableName: 'patients',
        timestamps: false,
    }
);

module.exports = Patient;