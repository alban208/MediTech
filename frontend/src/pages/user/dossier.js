import React, {useState, useEffect} from 'react';
import { useAuth } from '../../hooks/useAuth';
import "../../css/DossierPatient.css";

const Dossier = () => {
  const { userId } = useAuth();
  const [dossier, setDossier] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const accessToken = localStorage.getItem("authToken");
  useEffect(() => {
      const fetchDossier = async () => {
      try {
        const res = await fetch(`http://localhost:3001/auth/getMyDossier/${userId}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        if (res.ok) {
          const data = await res.json();
          setDossier(data);
        } else if (res.status === 404) {
          setDossier(null);
        } else {
          setError("Erreur lors de la récupération du dossier");
        }
      } catch (err) {
        console.error(err);
        setError("Erreur lors de la récupération du dossier");
      } finally {
        setLoading(false);
      }
    };

    fetchDossier();
  }, [accessToken, userId]);
  if (loading) return <div className="dossier-loading">Chargement...</div>;
  if (error) return <div className="dossier-error">{error}</div>;
  return (
    <div className="dossier-container">
      {dossier ? (
        <div className="dossier-card">
          <h2>Mon dossier médical</h2>
          <div className="dossier-section">
            <span className="dossier-label">Titre :</span>
            <span className="dossier-value">{dossier.titre}</span>
          </div>
          <div className="dossier-section">
            <span className="dossier-label">Poids :</span>
            <span className="dossier-value">{dossier.poids} kg</span>
          </div>
          <div className="dossier-section">
            <span className="dossier-label">Taille :</span>
            <span className="dossier-value">{dossier.taille} cm</span>
          </div>
          <div className="dossier-section">
            <span className="dossier-label">Température :</span>
            <span className="dossier-value">{dossier.temperature} °C</span>
          </div>
          <div className="dossier-section">
            <span className="dossier-label">Fréquence cardiaque :</span>
            <span className="dossier-value">{dossier.frequence_cardiaque} bpm</span>
          </div>
          <div className="dossier-section dossier-section--full">
            <span className="dossier-label">Traitements :</span>
            <span className="dossier-value">{dossier.traitements}</span>
          </div>
          <div className="dossier-section dossier-section--full">
            <span className="dossier-label">Observations :</span>
            <span className="dossier-value">{dossier.observations}</span>
          </div>
          <div className="dossier-footer">
            <span>Médecin chargé de votre dossier : Dr {dossier.medecin.prenom} {dossier.medecin.nom}</span>
          </div>
        </div>
      ) : (
        <div className="dossier-empty">
          <h3>Vous n'avez pas encore de dossier</h3>
          <p>Vos informations médicales apparaîtront ici dès qu'un médecin créera votre dossier.</p>
        </div>
      )}
    </div>
  );
};

export default Dossier;
