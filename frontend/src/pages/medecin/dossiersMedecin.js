import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import '../../css/DossiersMedecin.css';
import { useNavigate } from "react-router-dom";
import { notifySuccess, notifyError } from "../../scripts/notification";
import dayjs from "dayjs";

export default function DossiersMedecin() {
  const navigate = useNavigate();
  const accessToken = localStorage.getItem("authToken");
  const { userId: medecinId } = useAuth();
  const { dossierId } = useParams();
  const [dossiers, setDossiers] = useState([]);
  const [dossier, setDossier] = useState(null);
  const [editData, setEditData] = useState({});
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (dossierId) {
      fetch(`http://localhost:3001/medecin/getDossierById/${dossierId}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
        .then(res => res.json())
        .then((data) => {
          setDossier(data);
          setEditData(data);
        });
    } else {
      fetch(`http://localhost:3001/medecin/getDossierPatients/${medecinId}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
        .then(res => res.json())
        .then((data) => {
          setDossiers(data);
        });
    }
  }, [dossierId, medecinId, accessToken]);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const bodyData = { ...editData, id: dossier.id };
      const result = await fetch('http://localhost:3001/medecin/updateDossier', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`
        },
        body: JSON.stringify(bodyData)
      });
      if (result.ok) {
        const updatedDossier = await result.json();
        setDossier(updatedDossier);
        setIsEditing(false);
        notifySuccess("Dossier mis à jour avec succès");
      } else {
        notifyError("Erreur lors de la mise à jour du dossier");
      }
    } catch (error) {
      console.log("Error updating dossier: ", error);
      notifyError("Erreur lors de la mise à jour du dossier");
    }
  }


  if (dossierId) {
    return (
      <div className="dossier-detail">
        <h1>Dossier de {dossier?.patient?.prenom} {dossier?.patient?.nom}</h1>

        <form className="dossier-detail__form" onSubmit={handleSave}>
          <div className="dossier-detail__grid">
            {["titre", "poids", "taille", "temperature", "frequence_cardiaque", "traitements", "observations"].map(field => (
              <div key={field} className={`dossier-detail__group ${field.includes("traitements") || field.includes("observations") ? "full" : ""}`}>
                <label>{field.charAt(0).toUpperCase() + field.slice(1).replace("_"," ")}</label>
                {field === "traitements" || field === "observations" ? (
                  <textarea name={field} value={editData[field] || ""} onChange={handleChange} rows={field==="observations"?4:3}/>
                ) : (
                  <input type={field.includes("poids") || field.includes("taille") || field.includes("temperature") || field.includes("frequence") ? "number":"text"} name={field} value={editData[field] || ""} onChange={handleChange}/>
                )}
              </div>
            ))}
          </div>

          <div className="dossier-detail__actions">
            <button type="button" onClick={() => navigate(-1)} className="btn-back">← Retour</button>
            <button type="submit" className="btn-save">Enregistrer les modifications</button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="dossiers-page">
      <h1>Mes dossiers patients</h1>
      <div className="dossiers-grid">
        {dossiers.map(d => (
          <div key={d.id} className="dossier-card">
            <div className="dossier-card__header">
              <div className="dossier-card__avatar">
                {d.patient?.prenom[0]?.toUpperCase()}{d.patient?.nom[0]?.toUpperCase()}
              </div>
              <div className="dossier-card__info">
                <h3>{d.patient?.prenom} {d.patient?.nom}</h3>
                <span className="dossier-card__subtitle">{d.titre}</span>
              </div>
            </div>
            <div className="dossier-card__footer">
              <span className="dossier-card__date">
                {dayjs(d.createdAt).format("DD/MM/YYYY")}
              </span>
              <button onClick={() => navigate(`/medecin/dossiers/${d.id}`)} className="btn-view">
                Voir / Modifier
              </button>
            </div>
          </div>
        ))}
        {dossiers.length === 0 && <p className="empty-msg">Aucun dossier créé pour le moment.</p>}
      </div>
    </div>
  );
}

