const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const Specialite = require('../models/Specialite');
const Medecin = require('../models/Medecin');
const Rdv = require('../models/Rdv');
const Patient = require('../models/Patient');
const Dossier = require('../models/Dossier');
const { Op } = require('sequelize');
const { get } = require('../routes/authRoutes');

const login = asyncHandler(async (req, res) => {
    try {
        const { email, password } = req.body;

        if (email != null && password != null){
            const user = await User.findOne({
                where: { 
                    email: email
                }
            });
            if (user != null){
                const result = user.dataValues;
                bcrypt.compare(password, result.password).then(
                    (result) => {
                        if(result){
                            const accessToken = jwt.sign(
                                {
                                    "userInfos": {
                                        "email": user.email,
                                        "role": user.role,
                                        "id": user.id
                                    }
                                },
                                process.env.ACCESS_TOKEN_SECRET,
                                {
                                    expiresIn: '1h'
                                }
                            )
                            res.cookie('jwt', accessToken, {
                                httpOnly: true,
                                secure: true,
                                sameSite: 'None',
                                maxAge: 24 * 60 * 60 * 1000 
                            })

                            res.status(200).json({
                                accessToken,
                                user 
                            });
                        }
                        else{
                            res.status(400).send({"error": "email or password incorrect"});
                        }
                    }
                );
            }
            else{
                res.status(400).send({"error": "email or password incorrect"});
            }
        }
    } catch (error) {
        res.status(500).send({"error": "An error occurred during login"});
    }
});

const logout = asyncHandler(async (req, res) => {
    try {
        const cookies = req.cookies;
        if(!cookies?.jwt){
            return res.sendStatus(204);
        }
        res.clearCookie('jwt', {
            httpOnly: true,
            secure: true,
            sameSite: 'None'
        })
        res.json({message: "Logout successful"});
    } catch (error) {
        res.status(500).send({"error": "An error occurred during logout"});
    }
});

const me = async(req, res) => {
    try {
        const { userId } = req.params;
        if(!userId) res.status(401).send({"error": "User ID not found in token"});
        const userData = await User.findOne({
            where: { id: userId },
        });
        if(userData) {
            res.status(200).send(userData);
        } else {
            res.status(404).send({"error": "User not found"});
        }
    } catch(error) {
        res.status(500).send({"error": "An error occurred while fetching user data"});
    }
};

const editProfile = async (req, res) => {
    try {
        const { id, prenom, nom, email, oldPassword, newPassword, confirmPassword } = req.body;
        if(id != null){
            const user = await User.findOne({
                where: { id: id }
            });
            if(user){
                if(prenom != null) user.prenom = prenom;
                if(nom != null) user.nom = nom;
                if(email != null) user.email = email;

                if(oldPassword != null || newPassword != null || confirmPassword != null){
                    if(oldPassword == null || newPassword == null || confirmPassword == null){
                        return res.status(400).send({ error: "Pour changer de mot de passe l'ancien et le nouveau mot de passe doivent être fourni" });
                    }
                    const passwordMatch = await bcrypt.compare(oldPassword, user.password);
                    if(!passwordMatch){
                        return res.status(400).send({ error: "Ancien mot de passe incorrect" });
                    }
                    if(newPassword !== confirmPassword){
                        return res.status(400).send({ error: "Nouveau mot de passe et la confirmation ne correspondent pas"});
                    }
                    const hashedPassword = await bcrypt.hash(newPassword, 10);
                    user.password = hashedPassword;
                }
                await user.save();
                const { password, ...userWithoutPassword } = user.dataValues;
                res.status(200).json(userWithoutPassword);
            } else {
                res.status(404).send({"error": "User not found"});
            }
        }
        else {
                res.status(400).send({"error": "User ID is required"});
            }

    } catch (error) {
        console.log("Error in editProfile:", error);
        res.status(500).send({"error": "An error occurred while updating the profile"});
    }
}

const getDataforRdv = async (req, res) => {
    try {
        const specialites = await Specialite.findAll();
        const medecinsParSpecialite = {};

        for (const specialite of specialites) {

            const medecins = await Medecin.findAll({
                where: { specialite_id: specialite.id }
            });

            
            const medecinsAvecUser = [];
            for (const medecin of medecins) {
                const user = await User.findByPk(medecin.user_id);
                medecinsAvecUser.push({
                    ...medecin.toJSON(),
                    nom: user ? user.nom : null,
                    prenom: user ? user.prenom : null,
                    location: medecin.location ? medecin.location : null
                });
            }

            medecinsParSpecialite[specialite.nom] = medecinsAvecUser;
        }

        res.status(200).json({
            specialites,
            medecinsParSpecialite
        });
    } catch (error) {
        console.log("Error fetching data for RDV:", error);
        res.status(500).send({ error: "An error occurred while fetching data for RDV" });
    }
};

const addRdv = async (req, res) => {
    try {
        const { patient_id, medecin_id, start_datetime, end_datetime, location} = req.body;
        if (patient_id && medecin_id && start_datetime && end_datetime) {
            const rdv = await Rdv.create({
                patient_id: patient_id,
                medecin_id: medecin_id,
                start_datetime: new Date(start_datetime),
                end_datetime: new Date(end_datetime),
                location: location
            });
            res.status(201).send(rdv);
        }
        else {
            res.status(400).send({"error": "All fields are required"});
        }
    } catch (error) {
        console.log("Error adding RDV:", error);
        res.status(500).send({"error": "An error occurred while adding the RDV"});
    }
}

const getMedecinsDisponibles = async (req, res) => {
    try {
        const { date } = req.query;
        const startDatetime = new Date(date);
        const endDatetime = new Date(new Date(date).getTime() + 30 * 60000);

        const specialites = await Specialite.findAll();
        const medecins = await Medecin.findAll();
        const rdvs = await Rdv.findAll({
            where: {
            [Op.or]: [
                {
                start_datetime: {
                    [Op.lt]: endDatetime,
                },
                end_datetime: {
                    [Op.gt]: startDatetime,
                },
                },
            ],
            },
        });

        const medecinsOccupesIds = rdvs.map(r => r.medecin_id);

        // Organiser les médecins disponibles par spécialité
        const medecinsDisponiblesParSpecialite = {};

        for (const specialite of specialites) {
            const medecinsDeSpecialite = medecins.filter(
            m => m.specialite_id === specialite.id && !medecinsOccupesIds.includes(m.id)
            );

            const medecinsAvecUser = [];
            for (const medecin of medecinsDeSpecialite) {
            const user = await User.findByPk(medecin.user_id);
            medecinsAvecUser.push({
                ...medecin.toJSON(),
                nom: user ? user.nom : null,
                prenom: user ? user.prenom : null,
                location: medecin.location ? medecin.location : null
            });
            }

            medecinsDisponiblesParSpecialite[specialite.nom] = medecinsAvecUser;
        }

        res.status(200).json(medecinsDisponiblesParSpecialite);
    } catch (error) {
        console.log("Error fetching available medecins:", error);
        res.status(500).send({ error: "An error occurred while fetching available medecins" });
    }
}

const getMyRdvs = async (req, res) => {
  try {
    const { patient_id } = req.query;
    const rdvs = await Rdv.findAll({
      where: { patient_id: patient_id },
    });

    const now = new Date();
    const rdvData = [];

    for (const rdv of rdvs) {
      const medecin = await Medecin.findOne({ where: { id: rdv.medecin_id } });

      if (medecin) {
        const userMedecin = await User.findOne({ where: { id: medecin.user_id } });

        rdvData.push({
          id: rdv.id,
          start_datetime: rdv.start_datetime,
          end_datetime: rdv.end_datetime,
          location: medecin.location,
          isPast: new Date(rdv.end_datetime) < now, 
          medecin: {
            id: medecin.id,
            nom: userMedecin ? userMedecin.nom : null,
            prenom: userMedecin ? userMedecin.prenom : null,
            specialite_id: medecin.specialite_id,
          },
        });
      }
    }

    res.status(200).send(rdvData);
  } catch (error) {
    console.log("Error fetching my RDVs:", error);
    res.status(500).send({ error: "Erreur lors de la récupération des RDVs" });
  }
};

const getPastRdvs = async (req, res) => {
  try {
    const { user_id } = req.query;

    const rdvs = await Rdv.findAll({
      where: {
        patient_id: user_id,
        end_datetime: { [Op.lt]: new Date() } 
      }
    });

    const rdvData = [];
    for (const rdv of rdvs) {
      const medecin = await Medecin.findOne({ where: { id: rdv.medecin_id } });
      const userMedecin = medecin
        ? await User.findOne({ where: { id: medecin.user_id } })
        : null;
      let specialiteNom = "N/A";
      if (medecin?.specialite_id) {
        const specialite = await Specialite.findOne({ where: { id: medecin.specialite_id } });
        specialiteNom = specialite?.nom || "N/A";
      }
      rdvData.push({
        id: rdv.id,
        start_datetime: rdv.start_datetime,
        end_datetime: rdv.end_datetime,
        location: rdv.location,
        medecin: {
          id: medecin?.id,
          nom: userMedecin?.nom || "N/A",
          prenom: userMedecin?.prenom || "N/A",
          specialite: specialiteNom
        }
      });
    }

    res.status(200).send(rdvData);
  } catch (error) {
    console.log("Erreur dans getPastRdvs:", error);
    res.status(500).send({ error: "Erreur lors de la récupération des RDVs passés" });
  }
};


const delRdv = async (req, res) => {
    try {
        const { id} = req.body;
        if (id != null) {
            const rdv = await Rdv.findOne({
                where: { id: id }
            });
            if (rdv) {
                await rdv.destroy();
                res.status(200).send({"message": "RDV deleted successfully"});
            } else {
                res.status(404).send({"error": "RDV not found"});
            }
        } else {
            res.status(400).send({"error": "RDV ID is required"});
        }
    } catch (error) {
        res.status(500).send({"error": "An error occurred while deleting the RDV"});
    }
}
const getMyDossier = async (req, res) => {
    try {
        const {user_id} = req.params;
        const patient = await Patient.findOne({
            where: { user_id: user_id}
        });
        if (patient != null) {
            const dossier = await Dossier.findOne({
                where: { patient_id: patient.id }
            });
            if (dossier) {
                const medecin = await Medecin.findOne({
                    where: { user_id: dossier.medecin_id }
                });
                if (medecin) {
                    const userMedecin = await User.findOne({
                        where: { id: medecin.user_id }
                    });
                    dossier.dataValues.medecin = {
                        id: medecin.id,
                        nom: userMedecin ? userMedecin.nom : null,
                        prenom: userMedecin ? userMedecin.prenom : null,
                    };
                } else {
                    dossier.dataValues.medecin = null;
                }
                res.status(200).send(dossier);
            } else {
                res.status(404).send({"error": "Dossier not found"});
            }
        } else {
            res.status(400).send({"error": "Patient not found"});
        }
    } catch (error) {
        res.status(500).send({"error": "An error occurred while fetching the dossier"});
    }
}

module.exports = {
    login,
    logout,
    me,
    editProfile,
    getDataforRdv,
    addRdv,
    getMedecinsDisponibles,
    getMyRdvs,
    getPastRdvs,
    delRdv,
    getMyDossier
};