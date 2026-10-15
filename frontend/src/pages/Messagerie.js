import React, { useState, useEffect} from 'react';
import { useAuth } from '../hooks/useAuth';
import { io } from 'socket.io-client';
import "../css/Messagerie.css";

const socket = io('http://localhost:3001');

const Messagerie = () => {
    const { userEmail, userId } = useAuth();
    const [contacts, setContacts] = useState([]);
    const [selectedContact, setSelectedContact] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const accessToken = localStorage.getItem('authToken');

    useEffect(() => {
        if (userEmail) {
            socket.emit("joinRoom", userEmail);
        }
        const fetchContacts = async () => {
            try {
                const response = await fetch(`http://localhost:3001/messages/contacts/${userId}`,{
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                });
                const data = await response.json();
                setContacts(data);
            } catch (error) {
                console.error('Error fetching contacts:', error);
            }
        };

        fetchContacts();

    }, [userEmail, accessToken]);
    const fetchMessages = async (contactEmail) => {
    try {
        const result = await fetch(`http://localhost:3001/messages?user1=${userEmail}&user2=${contactEmail}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
        if (result.ok) {
            const data = await result.json();
            setMessages(data);

           
            if (data.length > 0) {
                await fetch(`http://localhost:3001/messages/markAsRead`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${accessToken}`
                    },
                    body: JSON.stringify({
                        expediteur_email: contactEmail,
                        destinataire_email: userEmail
                    })
                });
            }

            setContacts(prevContacts => prevContacts.map(contact => 
                contact.email === contactEmail ? { ...contact, unreadCount: 0 } : contact
            ));
        } else {
            console.error('Error fetching messages');
            setMessages([]);
        }
    } catch (error) {
        console.log('Error fetching messages:', error);
        setMessages([]);
    }
};
    const handleSelectContact = (contact) => {
      setSelectedContact(contact);
      fetchMessages(contact.email);
    };
    const handleSaveMessage = async (e) => {
        e.preventDefault();
        if (newMessage.trim() === '' || !selectedContact) return;

        const messageData = {
            expediteur_email: userEmail,
            destinataire_email: selectedContact.email,
            contenu: newMessage
        };
        socket.emit('sendMessage', messageData);
        setNewMessage('');
    };
    useEffect(() => {
        const handleReceiveMessage = (message) => {
            if (
                selectedContact &&
                (message.expediteur_email === selectedContact.email ||
                    message.destinataire_email === selectedContact.email)
            ) {
                
                setMessages((prev) => [...prev, message]);
            } else if (message.destinataire_email === userEmail) {
                
                setContacts((prev) =>
                    prev.map((c) =>
                        c.email === message.expediteur_email
                            ? { ...c, unreadCount: (c.unreadCount || 0) + 1 }
                            : c
                    )
                );
            }
        };

        socket.on("receiveMessage", handleReceiveMessage);

        return () => {
            socket.off("receiveMessage", handleReceiveMessage);
        };
    }, [selectedContact, userEmail]);

    return (
    <div className="chat-container">
      <div className="contacts-list">
        <h3>Mes contacts</h3>
        {contacts.map((contact) => (
          <div
            key={contact.email}
            className={`contact-item ${
              selectedContact?.email === contact.email ? "active" : ""
            }`}
            onClick={() => handleSelectContact(contact)}
          >
            <span className="contact-name">{contact.nom}</span>
            {contact.unreadCount > 0 && (
              <span className="notif-badge">{contact.unreadCount}</span>
            )}
          </div>
        ))}
      </div>

      <div className="chat-box">
        {selectedContact ? (
          <>
            <div className="chat-header">
              <h4>Conversation avec {selectedContact.nom}</h4>
            </div>
            <div className="chat-messages">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`message ${
                    msg.expediteur_email === userEmail
                      ? "sent"
                      : "received"
                  }`}
                >
                  <p>{msg.contenu}</p>
                  <small>
                    {new Date(msg.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </small>
                </div>
              ))}
            </div>
            <div className="chat-input">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Écrire un message..."
              />
              <button onClick={handleSaveMessage}>Envoyer</button>
            </div>
          </>
        ) : (
          <div className="chat-placeholder">
            <p>Sélectionnez un contact pour commencer la conversation.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Messagerie;