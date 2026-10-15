const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController.js');
const verifyLoggedJWT = require('../middleware/verifyLoggedJWT.js');

router.post('/', authController.login);
router.post('/logout', authController.logout);

router.use(verifyLoggedJWT);
router.get('/me/:userId', authController.me);
router.post('/editProfile', authController.editProfile);
router.get('/getDataforRdv', authController.getDataforRdv);
router.post('/addRdv', authController.addRdv);
router.get('/getMedecinsDisponibles', authController.getMedecinsDisponibles);
router.get('/getMyRdvs', authController.getMyRdvs);
router.get('/getPastRdvs', authController.getPastRdvs);
router.post('/delRdv', authController.delRdv);
router.get('/getMyDossier/:user_id', authController.getMyDossier);

module.exports = router;