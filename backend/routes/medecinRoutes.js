const express = require('express');
const router = express.Router();
const medecinController = require('../controllers/medecinController.js');
const verifyMedecinJWT = require('../middleware/verifyMedecinJWT.js');

router.use(verifyMedecinJWT);

router.post('/addDossier', medecinController.addDossier);
router.post('/updateDossier', medecinController.updateDossier);
router.post('/deleteDossier', medecinController.deleteDossier);
router.get('/getMyPatients/:medecin_id', medecinController.getMyPatients);
router.get('/getMyRdvs/:medecin_id', medecinController.getMyRdvs);
router.get('/getDossierPatients/:medecin_id', medecinController.getDossierPatients);
router.get('/getDossierById/:dossierId', medecinController.getDossierById);

module.exports = router;