import React, { useState } from 'react';
import { FaUserAlt, FaLock } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import '../css/Forms.css'; // <-- important

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const SubmitForm = (e) => {
    e.preventDefault();

    const data = {
      email: email,
      password: password
    }

    fetch("http://localhost:3001/auth/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    })
      .then((response) => {
        if (!response.ok) {
          alert("Email ou mot de passe incorrect");
          return;
        }
        return response.json();
      })
      .then((data) => {
        if (!data) return;
        localStorage.setItem('authToken', data.accessToken);
        let role = jwtDecode(data.accessToken).userInfos.role;
        if (role === 'ADMIN') navigate('/admin/dashboard');
        else if (role === 'MEDECIN') {navigate('/medecin/rdvs');}
        else navigate('/pages/user/rdv');
      });
  }

  return (
    <div className="form-container">
      <form className="login-form" onSubmit={SubmitForm}>
        <h1 className="form-title">Se connecter</h1>

        <div className="input-group">
          <input type="email" placeholder="Email" required onChange={(e) => setEmail(e.target.value)} />
          <FaUserAlt className="icon" />
        </div>

        <div className="input-group">
          <input type="password" placeholder="Mot de passe" required onChange={(e) => setPassword(e.target.value)} />
          <FaLock className="icon" />
        </div>

        <div className="options">
          <label className="remember">
            <input type="checkbox" /> Se souvenir de moi
          </label>
          <a href="#" className="forgot">Mot de passe oublié ?</a>
        </div>

        <button type="submit" className="submit-btn">Se connecter</button>

        <p className="register-text">
          Pas de compte ? <Link to="/signup" className="register-link">S'inscrire</Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
