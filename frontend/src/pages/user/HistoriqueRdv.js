import React, { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import '../../css/HistoriqueRdvPatient.css';

const HistoriqueRdvPatient = () => {
    const [pastRdvs, setPastRdvs] = useState([]);
    const accessToken = localStorage.getItem("authToken");
    const { userId } = useAuth();

    useEffect(() => {
        fetch(`http://localhost:3001/auth/getPastRdvs?user_id=${userId}`, {
            headers:{
                Authorization: `Bearer ${accessToken}`
            }
        })
        .then((response) => response.json())
        .then((data) => {
            setPastRdvs(data);
        })
    }, [accessToken, userId]);

    return (
    <div className="historique-container">
      <h2>📅 Historique de mes rendez-vous</h2>
      {pastRdvs.length === 0 ? (
        <p className="no-rdv">Aucun rendez-vous passé trouvé.</p>
      ) : (
        <div className="rdv-list">
          {pastRdvs.map(rdv => (
            <div key={rdv.id} className="rdv-card">
              <div className="rdv-info">
                <h3>
                  {rdv.medecin?.prenom} {rdv.medecin?.nom}
                </h3>
                <p><strong>Date :</strong> {new Date(rdv.start_datetime).toLocaleDateString()}</p>
                <p><strong>Heure :</strong> {new Date(rdv.start_datetime).toLocaleTimeString()}</p>
                <p><strong>Lieu :</strong> {rdv.location}</p>
              </div>
              <div className="rdv-meta">
                <span className="tag">Spécialité: {rdv.medecin?.specialite || "N/A"}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default HistoriqueRdvPatient;