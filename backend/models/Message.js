const sequelize = require('../database/config');
const { DataTypes } = require('sequelize');

const Message = sequelize.define(
  "Message",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    expediteur_email: {
      type: DataTypes.STRING,
    },
    destinataire_email: {
      type: DataTypes.STRING,
    },
    contenu: {
      type: DataTypes.TEXT("long"),
    },
    isRead: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    }
  },
  {
    tableName: "messages",
    timestamps: false,
  }
);

module.exports = Message;