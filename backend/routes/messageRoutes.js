const express = require('express');
const router = express.Router();
const { getMessages, getContacts, markMessagesAsRead } = require('../controllers/messageController.js');
const verifyLoggedJWT = require('../middleware/verifyLoggedJWT.js');

router.use(verifyLoggedJWT);
router.get('/', getMessages);
router.get('/contacts/:userId', getContacts);
router.post('/markAsRead', markMessagesAsRead);

module.exports = router;
