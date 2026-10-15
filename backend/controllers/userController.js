const User = require('../models/User');
const bcrypt = require('bcrypt');
const Rdv = require('../models/Rdv');
const Patient = require('../models/Patient');

const signup = async(req, res) => {
    try {
        const { prenom, nom, email, password} = req.body;
        if(prenom != null && nom != null && email != null && password !=null){
            const emailExists = await User.findOne({
                where: { email: email}
            });
            if(emailExists){
                res.status(400).send({"error": "Email already exists"});
            }
            else{
                bcrypt.hash(password,10).then((hash) => {
                    const role = "PATIENT";
                    const passwordHashed = hash;
                    User.create({
                        prenom: prenom,
                        nom: nom,
                        email: email,
                        password: passwordHashed,
                        role: role
                    }).then((result) => {
                        Patient.create({
                            user_id: result.id
                        }).then(() => {
                            res.status(201).send(result);
                        })   
                    })
                });
            }
        } else {
            res.status(400).send({"error": "All fields are required"});
        }
    } catch (error) {
        res.status(500).send({"error": "An error occurred during signup"});
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
const stats = async (req, res) => {
    try {
      const totalUsers = await User.count();
      const totalMedecins = await User.count({ where: { role: 'MEDECIN' } });
      const totalRdv = await Rdv.count();
      let stats = [];
      stats.push({
        users: totalUsers,
        doctors: totalMedecins,
        appointments: totalRdv
      });
      res.status(200).json(stats);
    } catch (error) {
        console.log("Error fetching stats: ", error);
        res.status(500).json({ error: 'An error occurred while fetching stats' });
    }
}

const testLogged = async (req, res) => {
    res.status(200).json({ message: "You are logged in!" });
}

module.exports = {
    signup,
    addAdmin,
    stats,
    testLogged
}