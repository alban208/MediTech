import React, { useRef, useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import '../css/Calendar.css';
import dayjs from 'dayjs';
import 'dayjs/locale/fr';
import { notifyError, notifySuccess } from '../scripts/notification';
import { useAuth } from '../hooks/useAuth';

const Calendrier = () => {
  const calendarRef = useRef(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const { userEmail, userId } = useAuth();

  const [userData, setUserData] = useState({});
  const [specialites, setSpecialites] = useState([]); 
  const [medecinsParSpecialite, setMedecinsParSpecialite] = useState({});
  const [medecinsDisponibles, setMedecinsDisponibles] = useState([]);
  const [selectedSpecialite, setSelectedSpecialite] = useState('');
  const [selectedMedecin, setSelectedMedecin] = useState('');
  const [events, setEvents] = useState([]);
  const accessToken = localStorage.getItem('authToken');

  useEffect(() => {
    fetch('http://localhost:3001/auth/me', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
      body: JSON.stringify({ email: userEmail })
    }).then((response) => response.json())
    .then((data) => {
      setUserData(data);
    });
    
    fetch('http://localhost:3001/auth/getDataforRdv', {

      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      }
    })
    .then((response) => response.json())
    .then((data) => {
      setSpecialites(data.specialites || [])
      setMedecinsParSpecialite(data.medecinsParSpecialite || {});
    })

    fetchRdv();
  }, [accessToken, userEmail]);
  const fetchRdv = async () => {
    try {
      const response = await fetch(`http://localhost:3001/auth/getMyRdvs?patient_id=${userId}`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
    });
    const data = await response.json();
      const formattedEvents = data.map(rdv => ({
        id: rdv.id,
        title: `RDV avec Dr ${rdv.medecin.prenom} ${rdv.medecin.nom}`,
        start: rdv.start_datetime,
        end: rdv.end_datetime,
        extendedProps: {
          location: rdv.location,
          rdv_id: rdv.id,
          isPast: rdv.isPast
        },
        color: rdv.isPast ? "gray" : "blue"
      }));
      console.log("RDV data:", data);
      setEvents(formattedEvents);
    } catch (error) {
      
    }
  }
  const handleAddRdv = async () => {
    if (!selectedMedecin || !selectedSpecialite) {
      notifyError("Veuillez sélectionner une spécialité et un médecin.");
      return;
    }
    const startDatetime = selectedSlot.value.format("YYYY-MM-DD HH:mm:ss");
    const endDatetime = selectedSlot.value.add(30, 'minute').format("YYYY-MM-DD HH:mm:ss");
    const medecin = medecinsParSpecialite[selectedSpecialite]?.find(
      (m) => m.nom === selectedMedecin
    );
    
    const result = await fetch('http://localhost:3001/auth/addRdv', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
      body: JSON.stringify({
        patient_id: userId,
        medecin_id: medecin?.id,
        start_datetime: startDatetime,
        end_datetime: endDatetime,
        location: medecinsParSpecialite[selectedSpecialite]?.find(m => m.nom === selectedMedecin)?.location || ''
      })
      
    });
    if (result.ok) {
      notifySuccess("Rendez-vous ajouté avec succès !");
      setModalOpen(false);
      setSelectedSlot(null);
      setSelectedSpecialite('');
      setSelectedMedecin('');
    } else {
      notifyError("Erreur lors de l'ajout du rendez-vous.");
    }
    fetchRdv();
    
  }

  const handleEventClick = (info) => {
    const isPast = info.event.extendedProps?.isPast;
    if (isPast) return;
    if (window.confirm(`Voulez-vous supprimer le rendez-vous avec ${info.event.title} ?`)) {
      const eventId = info.event.id;
      const rdvId = info.event.extendedProps?.rdv_id;
      fetch(`http://localhost:3001/auth/delRdv`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({ id: rdvId })
      }).then((response) => {
        if (response.ok) {
          info.event.remove();
          notifySuccess('Rendez-vous supprimé avec succès.');
        } else {
          notifyError("Erreur lors de la suppression du rendez-vous.");
        }
      });
      
    }
  }

  const handleDateClick = async (info) => {
    const now = dayjs();
    const clickedDate = dayjs(info.date);

    if (clickedDate.isBefore(now)) {
      notifyError("Vous ne pouvez pas prendre un rendez-vous dans le passé.");
      return;
    }

    setSelectedSlot({
    display: clickedDate.format('dddd DD/MM/YYYY HH:mm'), 
    value: clickedDate
  });
  const res = await fetch(`http://localhost:3001/auth/getMedecinsDisponibles?date=${clickedDate.format('YYYY-MM-DD HH:mm:ss')}`, {
      headers:{
        'Authorization': `Bearer ${accessToken}`
      }
  });
  const data = await res.json();
  setMedecinsDisponibles(data);
  setModalOpen(true);
  };
  const handleCancelClick = () => {
    setModalOpen(false);
    setSelectedSlot(null);
    setSelectedSpecialite('');
    setSelectedMedecin('');
  }

  return (
    <div>
      <FullCalendar
        ref={calendarRef}
        plugins={[timeGridPlugin, interactionPlugin, dayGridPlugin]}
        events={events}
        initialView="timeGridWeek"
        locale="fr"
        firstDay={1}
        allDaySlot={false}
        slotMinTime="08:00:00"
        slotMaxTime="20:00:00"
        height={'auto'}
        dateClick={handleDateClick}
        eventClick={handleEventClick}
        eventOverlap={false}
        validRange={{
          start: dayjs().startOf('week').add(1, 'day').toDate(),
        }}
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: '',
        }}
      />

      {modalOpen && (
      <div className="modal-overlay">
        <div className="modal-content">
          <h2 className="modal-title">📅 Prendre rendez-vous</h2>
          <p><strong>Créneau :</strong> {selectedSlot.display}</p>

          {/* Infos utilisateur */}
          {userData && (
            <div className="user-info">
              <p><strong>Nom :</strong> {userData?.nom}</p>
              <p><strong>Prénom :</strong> {userData?.prenom}</p>
              <p><strong>Email :</strong> {userData?.email}</p>
            </div>
          )}

          {/* Choix de spécialité */}
          <div className="form-group">
            <label>Spécialité :</label>
            <select
              value={selectedSpecialite}
              onChange={(e) => {
                setSelectedSpecialite(e.target.value);
                setSelectedMedecin('');
              }}
            >
              <option value="">-- Choisir une spécialité --</option>
              {specialites.map((s) => (
                <option key={s.id} value={s.nom}>
                  {s.nom}
                </option>
              ))}
            </select>
          </div>

          {/* Choix du médecin */}
          {selectedSpecialite && (
            <div className="form-group">
              <label>Médecin :</label>
              <select
                value={selectedMedecin}
                onChange={(e) => setSelectedMedecin(e.target.value)}
              >
                <option value="">-- Choisir un médecin --</option>
                {medecinsDisponibles[selectedSpecialite]?.map((m) => (
                  <option key={m.id} value={m.nom}>
                    {m.nom} {m.prenom}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Location */}
          {selectedMedecin && (
            <div className="form-group">
              <label>Lieu :</label>
              <input
                type="text"
                value={
                  medecinsDisponibles[selectedSpecialite]?.find(
                    (m) => m.nom === selectedMedecin
                  )?.location || ''
                }
                readOnly
              />
            </div>
          )}

          {/* Boutons */}
          <div className="modal-actions">
            <button className="btn-cancel" onClick={() => handleCancelClick()}>
              Annuler
            </button>
            <button className="btn-confirm" onClick={() => handleAddRdv()}>
              Confirmer
            </button>
          </div>
        </div>
      </div>
    )}
    </div>
  );
}

export default Calendrier;
