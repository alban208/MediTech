const Message = require('../models/Message.js');

function setUpMessageSocket(io) {
    io.on('connection', (socket) => {
        console.log('User connected : ', socket.id);

        socket.on('joinRoom', (email) => {
            socket.join(email);
        });

        socket.on('sendMessage', async (messageData) => {
            try {
                const { expediteur_email, destinataire_email, contenu } = messageData;
                if (!expediteur_email && !destinataire_email && !contenu) {
                    return;
                }
                const newMessage = await Message.create({
                  expediteur_email,
                  destinataire_email,
                  contenu,
                  isRead: false,
                  createdAt: new Date(),
                });

                const plainMessage = newMessage.get({ plain: true });

                io.to(destinataire_email).emit("receiveMessage", plainMessage);
                io.to(expediteur_email).emit("receiveMessage", plainMessage);
            } catch (error) {
                console.error('Error saving message:', error);
            }
        });
        socket.on('disconnect', () => {
            console.log('User disconnected : ', socket.id);
        });
    });
}

module.exports = setUpMessageSocket;