import React, { useEffect, useState } from "react";
import axios from "axios";
import { notifyError, notifySuccess } from "../../scripts/notification"; 
import { useAuth } from "../../hooks/useAuth";

function Profil() {
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({});
  const { userId } = useAuth();
  // Charger infos utilisateur
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) return;

    axios.get(`http://localhost:3001/auth/me/${userId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        setUser(res.data);
        setForm({ ...res.data, oldPassword: "", newPassword: "", confirmPassword: "" });
      })
      .catch(err => console.error("Erreur chargement profil:", err));
  }, []);


  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const token = localStorage.getItem("authToken");

    // Préparer les données à envoyer
    const updateData = {
      id: userId,
      prenom: form.prenom,
      nom: form.nom,
      email: form.email
    };

    // Ajouter mot de passe seulement si les 3 champs sont remplis
    if (form.oldPassword && form.newPassword && form.confirmPassword) {
      updateData.oldPassword = form.oldPassword;
      updateData.newPassword = form.newPassword;
      updateData.confirmPassword = form.confirmPassword;
    }

    fetch("http://localhost:3001/auth/editProfile", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(updateData)
    })
      .then(res => {
        if (!res.ok) throw res;
        return res.json();
      }
    )
      .then(() => {
        notifySuccess("Profil mis à jour avec succès ✅");
        setForm({ ...form, oldPassword: "", newPassword: "", confirmPassword: "" });
      })
      .catch(err => {
        console.log(err);
        notifyError(err.response?.data?.error || "Erreur lors de la mise à jour ❌");
      });
  };


  return (
    <div className="container mt-4">
      <h2>Mon Profil</h2>
      {user ? (
        <>
          <form onSubmit={handleSubmit} className="mb-4">
            <div className="mb-3">
              <label>Prénom</label>
              <input type="text" name="prenom" value={form.prenom || ""} onChange={handleChange} className="form-control" />
            </div>
            <div className="mb-3">
              <label>Nom</label>
              <input type="text" name="nom" value={form.nom || ""} onChange={handleChange} className="form-control" />
            </div>
            <div className="mb-3">
              <label>Email</label>
              <input type="email" name="email" value={form.email || ""} onChange={handleChange} className="form-control" />
            </div>

            {/* Mot de passe */}
            <div className="mb-3">
              <label>Ancien mot de passe</label>
              <input type="password" name="oldPassword" value={form.oldPassword || ""} onChange={handleChange} className="form-control" />
            </div>
            <div className="mb-3">
              <label>Nouveau mot de passe</label>
              <input type="password" name="newPassword" value={form.newPassword || ""} onChange={handleChange} className="form-control" />
            </div>
            <div className="mb-3">
              <label>Confirmer le nouveau mot de passe</label>
              <input type="password" name="confirmPassword" value={form.confirmPassword || ""} onChange={handleChange} className="form-control" />
            </div>

            <button type="submit" className="btn btn-primary">Mettre à jour</button>
          </form>


        </>
      ) : (
        <p>Chargement du profil...</p>
      )}
    </div>
  );
}

export default Profil;