import React, {useState, useEffect} from 'react';
import '../../css/Rdvs.css';
import { useAuth } from '../../hooks/useAuth';
import { notifySuccess, notifyError } from '../../scripts/notification';
import { useNavigate } from 'react-router-dom';
import dayjs from "dayjs";

const Rdvs = () => {
  const navigate = useNavigate();
  const [rdvs, setRdvs] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [formVisible, setFormVisible] = useState(false);
  const [formData, setFormData] = useState({
    titre: "",
    poids: "",
    taille: "",
    temperature: "",
    frequence_cardiaque: "",
    traitements: "",
    observations: "",
  });
  const [search, setSearch] = useState("");
  const accessToken = localStorage.getItem("authToken");
  const { userId } = useAuth();

  useEffect(() => {
    const fetchRdvs = async () => {
      try {
        const response = await fetch(
          `http://localhost:3001/medecin/getMyRdvs/${userId}`,
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );
        const data = await response.json();
        console.log("Fetched rdvs:", data);
        setRdvs(data);
      } catch (error) {
        console.log("Error fetching rdvs:", error);
      }
    };

    fetchRdvs();
  }, [userId, accessToken, selectedPatient]);

  const handleOpenForm = (patient) => {
    setSelectedPatient(patient);
    setFormVisible(true);
  };

  const closeForm = () => {
    setFormVisible(false);
    setSelectedPatient(null);
    setFormData({
      titre: "",
      poids: "",
      taille: "",
      temperature: "",
      frequence_cardiaque: "",
      traitements: "",
      observations: "",
    });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedPatient) return;

    const dossierData = {
      ...formData,
      patient_id: selectedPatient.id,
      medecin_id: userId,
    };

    try {
      const response = await fetch("http://localhost:3001/medecin/addDossier", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(dossierData),
      });

      if (response.ok) {
        notifySuccess("Dossier ajouté avec succès");
        closeForm();
      } else {
        notifyError("Erreur lors de l'ajout du dossier");
      }
    } catch (error) {
      console.error("Error submitting dossier:", error);
      notifyError("Erreur lors de l'ajout du dossier");
    }
  };

  const filtered = rdvs.filter((r) => {
    const fullName = `${r?.patient?.nom ?? ""} ${r?.patient?.prenom ?? ""}`.toLowerCase();
    return fullName.includes(search.toLowerCase());
  });

  return (
    <div className="med-rdv">
      <div className="med-rdv__header">
        <div className="med-rdv__title">
          <h1>Mes rendez-vous</h1>
          <p>Gérez vos créneaux et créez des dossiers patients</p>
        </div>
        <div className="med-rdv__search">
          <input
            type="text"
            placeholder="Rechercher un patient…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Rechercher un patient"
          />
        </div>
      </div>

      {/* Section RDV à venir */}
      <h2 className="med-rdv__section-title">À venir</h2>
      <div className="med-rdv__grid">
        {filtered
          .filter((rdv) => dayjs(rdv.start_datetime).isAfter(dayjs()))
          .map((rdv) => {
            const nom = rdv?.patient?.nom ?? "";
            const prenom = rdv?.patient?.prenom ?? "";
            const initials =
              (nom[0] ?? "").toUpperCase() + (prenom[0] ?? "").toUpperCase();
            return (
              <article key={rdv.id} className="med-rdv__card">
                <div className="med-rdv__card-main">
                  <div className="med-rdv__avatar" aria-hidden>
                    {initials || "👤"}
                  </div>
                  <div className="med-rdv__info">
                    <h3>
                      {prenom} {nom}
                    </h3>
                    <div className="med-rdv__meta">
                      <span className="med-chip">
                        {dayjs(rdv.start_datetime).format("DD/MM/YYYY")}
                      </span>
                      <span className="med-dot" />
                      <span className="med-chip">
                        {dayjs(rdv.start_datetime).format("HH:mm")} -{" "}
                        {dayjs(rdv.end_datetime).format("HH:mm")}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="med-rdv__actions">
                  {rdv.dossier ? (
                    <button
                      className="med-btn med-btn--secondary"
                      onClick={() => navigate(`/medecin/dossiers/${rdv.dossier}`)}
                    >
                      Voir dossier médical
                    </button>
                  ) : (
                    <button
                      className="med-btn med-btn--primary"
                      onClick={() => handleOpenForm(rdv.patient)}
                      disabled={!rdv.patient}
                    >
                      Créer dossier médical
                    </button>
                  )}
                </div>
              </article>
            );
          })}
      </div>

      {/* Section RDV passés */}
      <h2 className="med-rdv__section-title">Passés</h2>
      <div className="med-rdv__grid med-rdv__grid--past">
        {filtered
          .filter((rdv) => dayjs(rdv.end_datetime).isBefore(dayjs()))
          .map((rdv) => {
            const nom = rdv?.patient?.nom ?? "";
            const prenom = rdv?.patient?.prenom ?? "";
            const initials =
              (nom[0] ?? "").toUpperCase() + (prenom[0] ?? "").toUpperCase();
            return (
              <article
                key={rdv.id}
                className="med-rdv__card med-rdv__card--past"
              >
                <div className="med-rdv__card-main">
                  <div className="med-rdv__avatar" aria-hidden>
                    {initials || "👤"}
                  </div>
                  <div className="med-rdv__info">
                    <h3>
                      {prenom} {nom}
                    </h3>
                    <div className="med-rdv__meta">
                      <span className="med-chip">
                        {dayjs(rdv.start_datetime).format("DD/MM/YYYY")}
                      </span>
                      <span className="med-dot" />
                      <span className="med-chip">
                        {dayjs(rdv.start_datetime).format("HH:mm")} -{" "}
                        {dayjs(rdv.end_datetime).format("HH:mm")}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="med-rdv__actions">
                  <button className="med-btn med-btn--disabled" disabled>
                    RDV terminé
                  </button>
                </div>
              </article>
            );
          })}
      </div>

      {/* Form modal si visible */}
      {formVisible && selectedPatient && (
        <div className="med-rdv__modal" role="dialog" aria-modal="true">
          <div className="med-rdv__modal-content">
            <button
              className="med-rdv__modal-close"
              onClick={closeForm}
              aria-label="Fermer"
              type="button"
            >
              ×
            </button>
            <h2>
              Nouveau dossier — {selectedPatient.prenom} {selectedPatient.nom}
            </h2>

            <form className="med-rdv__form" onSubmit={handleSubmit}>
              <div className="med-form__grid">
                <div className="med-form__group">
                  <label htmlFor="titre">Titre</label>
                  <input
                    type="text"
                    id="titre"
                    name="titre"
                    value={formData.titre}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="med-form__group">
                  <label htmlFor="poids">Poids (kg)</label>
                  <input
                    type="number"
                    id="poids"
                    name="poids"
                    placeholder="ex: 70"
                    value={formData.poids}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="med-form__group">
                  <label htmlFor="taille">Taille (cm)</label>
                  <input
                    type="number"
                    id="taille"
                    name="taille"
                    placeholder="ex: 175"
                    value={formData.taille}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="med-form__group">
                  <label htmlFor="temperature">Température (°C)</label>
                  <input
                    type="number"
                    step="0.1"
                    id="temperature"
                    name="temperature"
                    placeholder="ex: 36.6"
                    value={formData.temperature}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="med-form__group">
                  <label htmlFor="frequence_cardiaque">
                    Fréquence cardiaque (bpm)
                  </label>
                  <input
                    type="number"
                    id="frequence_cardiaque"
                    name="frequence_cardiaque"
                    placeholder="ex: 70"
                    value={formData.frequence_cardiaque}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="med-form__group med-form__group--full">
                  <label htmlFor="traitements">Traitements</label>
                  <textarea
                    id="traitements"
                    name="traitements"
                    value={formData.traitements}
                    onChange={handleChange}
                    rows="4"
                  />
                </div>
                <div className="med-form__group med-form__group--full">
                  <label htmlFor="observations">Observations</label>
                  <textarea
                    id="observations"
                    name="observations"
                    value={formData.observations}
                    onChange={handleChange}
                    rows="4"
                  />
                </div>
              </div>

              <div className="med-rdv__form-actions">
                <button type="button" className="med-btn" onClick={closeForm}>
                  Annuler
                </button>
                <button type="submit" className="med-btn med-btn--primary">
                  Enregistrer le dossier
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};


export default Rdvs;
