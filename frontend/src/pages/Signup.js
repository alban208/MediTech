
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../css/Forms.css';
import { FaLock,FaUserAlt } from 'react-icons/fa';

const Signup = () => {
  const [formData, setFormData] = useState({
    prenom: '',
    nom: '',
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3001/users/signup', formData);
      alert('Compte créé avec succès !');
      console.log(response.data);
      navigate('/login');
    } catch (error) {
      alert('Erreur lors de la création du compte');
      console.error(error.response?.data || error.message);
    }
  };

  return (
    <div className="form-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h1 className="form-title">Inscription</h1>

        <div className="input-group">
          <input type="text" name="prenom" placeholder="Prénom" onChange={handleChange} required />
        </div>

        <div className="input-group">
          <input type="text" name="nom" placeholder="Nom" onChange={handleChange} required />
        </div>

        <div className="input-group">
          <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
          <FaUserAlt className="icon" />
        </div>

        <div className="input-group">
          <input type="password" name="password" placeholder="Mot de passe" onChange={handleChange} required />
          <FaLock className="icon" />
        </div>

        <button type="submit" className="submit-btn">Créer un compte</button>

        <p className="register-text">
          Déjà inscrit ? <a href="/login" className="register-link">Se connecter</a>
        </p>
      </form>
    </div>
  );
};

export default Signup;
