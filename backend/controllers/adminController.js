const User = require('../models/User.js');
const Medecin = require('../models/Medecin.js');
const Specialite = require('../models/Specialite.js');
const bcrypt = require('bcrypt');


const addMedecin = async (req, res) => {
    try {
        const { prenom, nom, email, password, specialite_id, location } = req.body;
        if (prenom != null && nom != null && email != null && password != null) {
            const emailExists = await User.findOne({
                where: { email: email }
            });
            if (emailExists) {
                res.status(400).send({ "error": "Email already exists" });
            } else {
                const hash = await bcrypt.hash(password, 10);
                const role = "MEDECIN";
                const user = await User.create({
                    prenom: prenom,
                    nom: nom,
                    email: email,
                    password: hash,
                    role: role
                });
                const medecin = await Medecin.create({
                    user_id: user.id,
                    specialite_id: specialite_id,
                    location: location
                });
                res.status(201).send({ user, medecin });
            }
        } else {
            res.status(400).send({ "error": "All fields are required" });
        }
    } catch (error) {
        res.status(500).send({ "error": "An error occurred while adding the doctor" });
    }
}

const updateMedecin = async (req, res) => {
    try {
        const { id, prenom, nom, email, password, specialite_id, location} = req.body;
        if (id != null){
            const user = await User.findOne({
                where: {id: id}
            });
            if(user){
                if(prenom != null) user.prenom = prenom;
                if(nom != null) user.nom = nom;
                if(email != null) user.email = email;
                if(password != null){
                    const hash = await bcrypt.hash(password, 10);
                    user.password = hash;
                }
                await user.save();
                const medecin = await Medecin.findOne({
                    where: { user_id: id}
                });
                if(medecin){
                    if(specialite_id != null) medecin.specialite_id = specialite_id;
                    if(location != null) medecin.location = location;
                    await medecin.save();
                }
                res.status(200).send({ user, medecin });
            }
            else{
                res.status(400).send({ "error": "User not found" });
            }   
        }
        else{
            res.status(400).send({ "error": "User ID is required" });
        }
    } catch (error) {
        res.status(500).send({ "error": "An error occurred while updating the doctor" });
    }
}

const deleteMedecin = async(req, res) => {
    try {
        const { id } = req.body;
        if (id != null) {
            const user = await User.findOne({
                where: { id: id}
            });
            if(user){
                await user.destroy();
                const medecin = await Medecin.findOne({
                    where: { user_id: id}
                });
                if(medecin){
                    await medecin.destroy();
                    res.status(200).send({ "message": "Doctor deleted successfully" });
                }
                else {
                    console.log("Medecin not found for user ID:", id);
                }
            }
            else {
                res.status(400).send({ "error": "User not found" });
            }
        }
        else {
            res.status(400).send({ "error": "User ID is required" });
        }
    } catch (error) {
        res.status(500).send({ "error": "An error occurred while deleting the doctor" });
    }
}

const addAdmin = async(req, res) => {
    try {
        const { prenom, nom, email, password } = req.body;
        if(prenom != null && nom != null && email != null && password != null){
            const emailExists = await User.findOne({
                where: { email: email} 
            });
            if(emailExists){
                res.status(400).send({"error": "Email already exists"});
            }
            else {
                bcrypt.hash(password, 10).then((hash) => {
                    const role = "ADMIN";
                    const passwordHashed = hash;
                    User.create({
                        prenom: prenom,
                        nom: nom,
                        email: email,
                        password: passwordHashed,
                        role: role
                    }).then((result) => {
                        res.status(201).send(result);
                    });
                });
            }
        }
        else{
            res.status(400).send({"error": "All fields are required"});
        }
    } catch (error) {
        res.status(500).send({"error": "An error occurred while adding the admin"});
    }
}

const updateAdmin = async (req, res) => {
    try {
        const { id, prenom, nom, email, password} = req.body;
        if(id != null){
            const user = await User.findOne({
                where: { id: id}
            });
            if(user){
                if(prenom != null ) user.prenom = prenom;
                if(nom != null) user.nom = nom;
                if(email != null) user.email = email;
                if(password != null){
                    const hash = await bcrypt.hash(password, 10);
                    user.password = hash;
                }
                await user.save();
                res.status(200).send(user);
            }
            else{
                res.status(400).send({"error": "User not found"});
            }
        }
        else {
            res.status(400).send({"error": "User ID is required"});
        }
    } catch (error) {
        res.status(500).send({"error": "An error occurred while updating the admin"});
    }
}

const deleteAdmin = async (req, res) => {
    try {
        const { id} = req.body;
        if(id != null){
            const user = await User.findOne({
                where: {id: id}
            });
            if(user){
                await user.destroy();
                res.status(200).send({"message": "Admin deleted successfully"});
            }
            else{
                res.status(400).send({"error": "User not found"});  
            }
        }
        else{
            res.status(400).send({"error": "User ID is required"});
        }
    } catch (error) {
        res.status(500).send({"error": "An error occurred while deleting the admin"});
    }
}


const addUser = async (req, res) => {
    try {
        const { prenom, nom, email, password} = req.body;
        if(prenom != null && nom != null && email != null && password != null){
            const emailExists = await User.findOne({
                where: { email: email}
            });
            if(emailExists){
                res.status(400).send({"error": "Emmail already exists"});
            }
            else{
                const hash = await bcrypt.hash(password, 10);
                const role = "PATIENT";
                const user = await User.create({
                    prenom: prenom,
                    nom: nom,
                    email: email,
                    password: hash,
                    role: role
                });
                res.status(201).send(user);
            }
        }
        else{
            res.stauts(400).send({"error": "All fields are required"});
        }
    } catch (error) {
        res.status(500).send({"error": "An error occurred while adding the user"});
    }
}

const updateUser = async (req, res) => {
    try {
        const {id, prenom, nom, email, password} = req.body;
        if(id != null){
            const user = await User.findOne({
                where: { id: id}
            });
            if(user){
                if(prenom != null) user.prenom = prenom;
                if(nom != null) user.nom = nom;
                if(email != null) user.email = email;
                if(password != null){
                    const hash = await bcrypt.hash(password, 10);
                    user.password = hash;
                }
                await user.save();
                res.status(200).send(user);
            }
            else{
                res.status(400).send({"error": "User not found"});
            }
        }
        else{
            res.status(400).send({"error": "User ID is required"});
        }
    } catch (error) {
        res.status(500).send({"error": "An error occurred while updating the user"});
    }
}


const deleteUser = async(req, res) => {
    try {
        const { id } = req.body;
        if(id != null) {
            const user = await User.findOne({
                where: { id: id}
            });
            if(user){
                await user.destroy();
                res.status(200).send({"message": "User deleted successfully"});
            }
            else{
                res.status(400).send({"error": "User not found"});
            }
        }
        else{
            res.status(400).send({"error": "User ID is required"});
        }
    } catch (error) {
        res.status(500).send({"error": "An error occurred while deleting the user"});
    }
}


const addSpecialite = async (req, res) => {
    try {
        const { nom } = req.body;
        if(nom !=null ){
            const specialiteExists = await Specialite.findOne({
                where: { nom: nom}
            });
            if(specialiteExists){
                res.status(400).send({"error": "Speciality already exists"});
            }
            else{
                const specialite = await Specialite.create({
                    nom: nom
                });
                res.status(201).send(specialite);
            }
        }
        else{
            res.status(400).send({"error": "Speciality name is required"});
        }
    } catch (error) {
        res.status(500).send({"error": "An error occurred while adding the speciality"});
    }
}

const updateSpecialite = async (req, res) => {
    try{
        const {nom} = req.body;
        if(nom != null){
            const specialite = await Specialite.findOne({
                where: { nom: nom}
            });
            if(specialite){
                specialite.nom = nom;
                await specialite.save();
                res.status(200).send(specialite);
            }
            else{
                res.status(400).send({"error": "Speciality not found"});
            }
        }
        else{
            res.status(400).send({"error": "Speciality name is required"});
        }
    }catch(error){
        res.status(500).send({"error": "An error occurred while updating the speciality"});
    }
}

const deleteSpecialite = async (req, res) => {
    try {
        const { nom } = req.body;
        if(nom != null){
            const specialite = await Specialite.findOne({
                where: { nom: nom}
            });
            if(specialite){
                await specialite.destroy();
                res.status(200).send({"message": "Speciality deleted successfully"});
            }
            else{
                res.status(400).send({"error": "Speciality not found"});
            }
        }
        else{
            res.status(400).send({"error": "Speciality name is required"});
        }
    } catch (error) {
        res.status(500).send({"error": "An error occurred while deleting the speciality"});
    }
}

const getAllUsers = async (req, res) => {
    try {
        const patients = await User.findAll({
            where: { role: 'PATIENT'}
        });
        const medecinsUsers = await User.findAll({
            where: { role: 'MEDECIN'}
        });
        const admins = await User.findAll({
            where: { role: 'ADMIN'}
        });
        const medecins = await Promise.all(
          medecinsUsers.map(async (user) => {
            const medecinInfo = await Medecin.findOne({
              where: { user_id: user.id },
            });
            return {
              ...user.toJSON(),
              specialite_id: medecinInfo ? medecinInfo.specialite_id : null,
              location: medecinInfo ? medecinInfo.location : null,
            };
          })
        );
        res.status(200).send({ patients, medecins, admins });
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).send({"error": "An error occurred while fetching users"});
    }
}


const getAllSpecialites = async (req, res) => {
    try {
        const specialites = await Specialite.findAll();
        res.status(200).send(specialites);
    } catch (error) {
        res.status(500).send({"error": "An error occurred while fetching specialities"});
    }
}

module.exports = {
    addMedecin,
    updateMedecin,
    deleteMedecin,  
    addAdmin,
    updateAdmin,
    deleteAdmin,
    addUser,
    updateUser,
    deleteUser,
    addSpecialite,
    updateSpecialite,
    deleteSpecialite,
    getAllUsers,
    getAllSpecialites
};