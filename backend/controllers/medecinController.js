const User = require('../models/User.js');
const Dossier = require('../models/Dossier.js');
const Patient = require('../models/Patient.js');
const Medecin = require('../models/Medecin.js');
const Rdv = require('../models/Rdv.js');


const addDossier = async (req, res) => {
    try {
        const { patient_id, medecin_id, titre, poids, taille, temperature, frequence_cardiaque, traitements, observations } = req.body;
        if (patient_id != null && medecin_id != null && titre != null) {
            const dossier = await Dossier.create({
                patient_id: patient_id,
                medecin_id: medecin_id,
                titre: titre,
                poids: poids,
                taille: taille,
                temperature: temperature,
                frequence_cardiaque: frequence_cardiaque,
                traitements: traitements,
                observations: observations
            });
            res.status(201).send(dossier);
        }
        else {
            res.status(400).send({ "error": "patient_id, medecin_id and titre are required" });
        }
    } catch (error) {
        res.status(500).send({ "error": "An error occurred while adding the dossier" });
    }
}

const updateDossier = async (req, res) => {
    try {
        const { id, patient_id, medecin_id, titre, poids, taille, temperature, frequence_cardiaque, traitements, observations } = req.body;
        if (id != null) {
            const dossier = await Dossier.findOne({
                where: { id: id }
            });
            if (dossier) {
                if (patient_id != null) dossier.patient_id = patient_id;
                if (medecin_id != null) dossier.medecin_id = medecin_id;
                if (titre != null) dossier.titre = titre;
                if (poids != null) dossier.poids = poids;
                if (taille != null) dossier.taille = taille;
                if (temperature != null) dossier.temperature = temperature;
                if (frequence_cardiaque != null) dossier.frequence_cardiaque = frequence_cardiaque;
                if (traitements != null) dossier.traitements = traitements;
                if (observations != null) dossier.observations = observations;

                await dossier.save();
                res.status(200).send(dossier);
            } else {
                res.status(404).send({ "error": "Dossier not found" });
            }
        } else {
            res.status(400).send({ "error": "Dossier ID is required" });
        }
    } catch (error) {
        res.status(500).send({ "error": "An error occurred while updating the dossier" });
    }
}

const deleteDossier = async (req, res) => {
    try {
        const { id } = req.body;
        if (id != null) {
            const dossier = await Dossier.findOne({
                where: { id: id }
            });
            if (dossier) {
                await dossier.destroy();
                res.status(200).send({ "message": "Dossier deleted successfully" });
            } else {
                res.status(404).send({ "error": "Dossier not found" });
            }
        } else {
            res.status(400).send({ "error": "Dossier ID is required" });
        }
    } catch (error) {
        res.status(500).send({ "error": "An error occurred while deleting the dossier" });
    }
}


const getMyPatients = async (req, res) => {
    try {
        const { medecin_id } = req.params;
        if (medecin_id != null) {
            const dossiers = await Dossier.findAll({
                where: { medecin_id: medecin_id },
                include: [{
                    model: Patient,
                    as: 'patient',
                    attributes: ['id', 'user_id'],
                    include: [{
                        model: User,
                        as: 'user',
                        attributes: ['id', 'nom', 'prenom', 'email', 'date_naissance']
                    }]
                }]
            });
            const patients = dossiers.map(dossier => {
                if (dossier.patient && dossier.patient.user) {
                    return {
                        id: dossier.patient.id,
                        user_id: dossier.patient.user_id,
                        nom: dossier.patient.user.nom,
                        prenom: dossier.patient.user.prenom,
                        email: dossier.patient.user.email,
                        date_naissance: dossier.patient.user.date_naissance
                    };
                }
                return null;
            }).filter(p => p !== null);
            res.status(200).send(patients);
        } else {
            res.status(400).send({ "error": "medecin_id is required" });
        }
    } catch (error) {
        res.status(500).send({ "error": "An error occurred while fetching patients" });
    }
}

const getMyRdvs = async (req, res) => {
    try {
        const { medecin_id } = req.params;
        if (!medecin_id) return res.status(400).json({ error: "medecin_id is required" });
        const medecin = await Medecin.findOne({ where: { user_id: medecin_id } });

        const rdvs = await Rdv.findAll({
            where: { medecin_id: medecin.id },
            order: [["start_datetime", "ASC"]],
        });
        const now = new Date();
        
        const result = await Promise.all(rdvs.map(async (rdv) => {
            let patientData = null;
            let dossierExistant = {};
            if (rdv.patient_id) {
                const patient = await Patient.findOne({ where: { user_id: rdv.patient_id } });
                if (patient) {
                    const user = await User.findByPk(patient.user_id);
                    patientData = user ? { id: patient.id, nom: user.nom, prenom: user.prenom } : null;

                    dossierExistant = await Dossier.findOne({
                        where: {
                            patient_id: patient.id,
                        }
                    });
                }
            }
            return {
                id: rdv.id,
                start_datetime: rdv.start_datetime,
                end_datetime: rdv.end_datetime,
                location: rdv.location,
                patient: patientData,
                dossier: dossierExistant ? dossierExistant.id : null,
            };
        }));


        res.status(200).send(result);
    } catch (error) {
        console.error("Erreur dans getMyRdvs :", error);
        res.status(500).json({ error: "An error occurred while fetching rdvs" });
    }
};

const getDossierPatients = async (req, res) => {
    try {
        const { medecin_id } = req.params;
        if (!medecin_id) res.status(400).send({ error: "Medecin id is required" });
        const medecin = await Medecin.findOne({
            where: { user_id: medecin_id }
        });
        const dossiers = await Dossier.findAll({
            where: {
                medecin_id: medecin.user_id
            }
        });
        const result = await Promise.all(dossiers.map(async (dossier) => {
            let patientData = null;
            if (dossier.patient_id) {
                const patient = await Patient.findOne({ where: { id: dossier.patient_id } });
                if (patient) {
                    const user = await User.findByPk(patient.user_id);
                    patientData = user ? { id: patient.id, nom: user.nom, prenom: user.prenom } : null;
                }
            }
            return {
                id: dossier.id,
                titre: dossier.titre,
                poids: dossier.poids,
                taille: dossier.taille,
                temperature: dossier.temperature,
                frequence_cardiaque: dossier.frequence_cardiaque,
                traitements: dossier.traitements,
                observations: dossier.observations,
                patient: patientData,
            }
        }));
        res.status(200).send(result);
    } catch (error) {
        console.log("Error while fetching dossiers : ", error);
        res.status(500).send("Internal Server error while fetching dossiers");
    }

};

const getDossierById = async (req, res) => {
  try {
    const { dossierId } = req.params;
    const dossier = await Dossier.findByPk(dossierId);

    if (!dossier) return res.status(404).json({ error: "Dossier introuvable" });

    const patient = await Patient.findByPk(dossier.patient_id);
    const user = patient ? await User.findByPk(patient.user_id) : null;

    res.status(200).json({
      ...dossier.toJSON(),
      patient: user ? { nom: user.nom, prenom: user.prenom } : null
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur lors de la récupération du dossier" });
  }
};


module.exports = {
    addDossier,
    updateDossier,
    deleteDossier,
    getMyPatients,
    getMyRdvs,
    getDossierPatients,
    getDossierById,
};