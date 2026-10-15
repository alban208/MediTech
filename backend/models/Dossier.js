const sequelize = require('../database/config');
const { DataTypes } = require('sequelize');

const Dossier = sequelize.define(
    'Dossier',
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
        titre: {
            type: DataTypes.STRING(254),
        },
        poids: {
            type: DataTypes.STRING(100),
        },
        taille: {
            type: DataTypes.STRING(100),
        },
        temperature: {
            type: DataTypes.STRING(100),
        },
        frequence_cardiaque: {
            type: DataTypes.STRING(100),
        },
        traitements: {
            type: DataTypes.TEXT('long'),
        },
        observations: {
            type: DataTypes.TEXT('long'),
        },
    }, {
        tableName: 'dossiers',
        timestamps: false,
    }
);

module.exports = Dossier;