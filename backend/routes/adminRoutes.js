const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController.js');

const verifyAdminJWT = require('../middleware/verifyAdminJWT.js');

router.use(verifyAdminJWT);

router.get('/allUsers', adminController.getAllUsers);
router.post('/addMedecin', adminController.addMedecin);
router.post('/updateMedecin', adminController.updateMedecin);
router.post('/deleteMedecin', adminController.deleteMedecin);
router.post('/addAdmin', adminController.addAdmin);
router.post('/updateAdmin', adminController.updateAdmin);
router.post('/deleteAdmin', adminController.deleteAdmin);
router.post('/addUser', adminController.addUser);
router.post('/updateUser', adminController.updateUser);
router.post('/deleteUser', adminController.deleteUser);
router.post('/addSpecialite', adminController.addSpecialite);
router.post('/updateSpecialite', adminController.updateSpecialite);
router.post('/deleteSpecialite', adminController.deleteSpecialite);
router.get('/getAllSpecialites', adminController.getAllSpecialites);


module.exports = router;