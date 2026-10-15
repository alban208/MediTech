const Message = require('../models/Message.js');
const User = require('../models/User.js');
const Patient = require('../models/Patient.js');
const Medecin = require('../models/Medecin.js')
const Rdv = require('../models/Rdv.js');
const { Op } = require('sequelize');

const getMessages = async (req, res) => {
  const { user1, user2 } = req.query;
  try {
    const messages = await Message.findAll({
      where: {
        [Op.or]: [
          { expediteur_email: user1, destinataire_email: user2 },
          { expediteur_email: user2, destinataire_email: user1 }
        ]
      },
      order: [['createdAt', 'ASC']]
    });
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching messages' });
  }
};

const markMessagesAsRead = async (req, res) => {
  const { expediteur_email, destinataire_email } = req.body;
  try {
    await Message.update(
      { isRead: true },
      {
        where: {
          expediteur_email,
          destinataire_email,
          isRead: false
        }
      }
    );
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Error marking messages as read' });
  }
};

const saveMessage = async (req, res) => {
    const { expediteur_email, destinataire_email, contenu } = req.body;
    try {
        if (!expediteur_email || !destinataire_email || !contenu) {
            return res.status(400).json({ error: 'All fields are required' });
        }
        const newMessage = await Message.create({
            expediteur_email,
            destinataire_email,
            contenu
        });
        res.status(201).json(newMessage);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while saving the message' });
    }
}

const getContacts = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findByPk(userId, { attributes: ["id", "role"] });
    if (!user) return res.status(404).json({ error: "User not found" });

    let contacts = [];

    if (user.role === "PATIENT") {
      
      const patient = await Patient.findOne({ where: { user_id: userId } });
      if (!patient) return res.status(404).json({ error: "Patient not found" });

      
      const rdvs = await Rdv.findAll({ where: { patient_id: patient.user_id } });

    
      const medecinIds = [...new Set(rdvs.map(r => r.medecin_id).filter(Boolean))];
      if (medecinIds.length === 0) return res.status(200).json([]);

     
      const medecins = await Medecin.findAll({
        where: { id: { [Op.in]: medecinIds } },
        attributes: ["id", "user_id"]
      });

      const medecinUserIds = medecins.map(m => m.user_id).filter(Boolean);
      if (medecinUserIds.length === 0) return res.status(200).json([]);

      contacts = await User.findAll({
        where: { id: { [Op.in]: medecinUserIds } },
        attributes: ["id", "nom", "prenom", "email", "role"]
      });

    } else if (user.role === "MEDECIN") {
      
      const medecin = await Medecin.findOne({ where: { user_id: userId } });
      if (!medecin) return res.status(404).json({ error: "Medecin not found" });

      
      const rdvs = await Rdv.findAll({ where: { medecin_id: medecin.id } });

      
      const patientIds = [...new Set(rdvs.map(r => r.patient_id).filter(Boolean))];
      if (patientIds.length === 0) return res.status(200).json([]);

      const patients = await Patient.findAll({
        where: { user_id: { [Op.in]: patientIds } },
        attributes: ["id", "user_id"]
      });

      const patientUserIds = patients.map(p => p.user_id).filter(Boolean);
      if (patientUserIds.length === 0) return res.status(200).json([]);

      contacts = await User.findAll({
        where: { id: { [Op.in]: patientUserIds } },
        attributes: ["id", "nom", "prenom", "email", "role"]
      });

    } else {
      return res.status(400).json({ error: "Role not supported" });
    }
    res.status(200).json(contacts);
  } catch (error) {
    console.error("Error fetching contacts:", error);
    res.status(500).json({ error: "An error occurred while fetching contacts" });
  }
};

module.exports = {
    getMessages,
    saveMessage,
    markMessagesAsRead,
    getContacts,
};