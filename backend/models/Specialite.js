const sequelize = require('../database/config');
const { DataTypes } = require('sequelize');

const Specialite = sequelize.define(
    'Specialite',
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        nom: {
            type: DataTypes.STRING(100),
        }
    }, {
        tableName: 'specialites',
        timestamps: false,
    }
);

module.exports = Specialite;