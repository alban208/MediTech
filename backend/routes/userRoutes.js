const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController.js');
const chatBot = require('../chatBot.js')
const verifyLoggedJWT = require('../middleware/verifyLoggedJWT.js');


router.post('/signup', userController.signup);
router.post('/addadmin', userController.addAdmin);
router.post('/chatbot', chatBot.askQuestion);
router.get('/stats', userController.stats);

router.use(verifyLoggedJWT);
router.get('/testLogged', userController.testLogged);
module.exports = router;