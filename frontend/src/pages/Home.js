import React, { useEffect, useState } from "react";
import "../css/Home.css";
import { Link } from "react-router-dom";

const Home = () => {
  const [stats, setStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(true);
  useEffect(() => {
    fetch('http://localhost:3001/users/stats')
    .then(res => res.json())
    .then(data => {
      setStats(data)
      console.log("Stats data:", data);
    })
    .catch(() => {})
    .finally(() => setLoadingStats(false));
  }, []);
  return (
    <div className="home-landing">
      {/* HERO */}
      <section className="home-landing__hero">
        <div className="home-landing__hero-inner">
          <div className="home-landing__hero-text">
            <h1 className="home-landing__title">MediTech</h1>
            <p className="home-landing__subtitle">
              La télé-médecine, simplement. Prenez rendez-vous, discutez avec votre médecin,
              consultez votre dossier et obtenez des réponses immédiates.
            </p>
            <div className="home-landing__cta-row">
              <Link to="/signup" className="home-landing__btn home-landing__btn--primary">
                Créer mon compte
              </Link>
              <Link to="/pages/user/rdv" className="home-landing__btn home-landing__btn--ghost">
                Voir le calendrier
              </Link>
            </div>
          </div>

          <div className="home-landing__hero-visual" aria-hidden="true">
            {/* Remplace la src par ton image réelle */}
            <img
              src="/telemedecine.png"
              alt=""
              className="home-landing__hero-img"
            />
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="home-landing__features">
        <div className="home-landing__section-head">
          <h2>Tout pour votre suivi médical en ligne</h2>
          <p>Des outils clairs et sécurisés pour faciliter vos démarches au quotidien.</p>
        </div>

        <div className="home-landing__cards">
          <article className="home-card">
            <div className="home-card__icon">
              <img src="/calendar-svgrepo-com.svg" alt="" />
            </div>
            <h3 className="home-card__title">Prendre rendez-vous</h3>
            <p className="home-card__desc">
              Réservez un créneau en quelques clics via un calendrier simple et clair.
            </p>
            <Link to="/pages/user/rdv" className="home-card__link">Accéder au calendrier</Link>
          </article>

          <article className="home-card">
            <div className="home-card__icon">
              <img src="/chat-svgrepo-com.svg" alt="" />
            </div>
            <h3 className="home-card__title">Discuter avec son médecin</h3>
            <p className="home-card__desc">
              Échangez en toute sécurité via la messagerie intégrée de MediTech.
            </p>
            <Link to="/pages/messagerie" className="home-card__link">Ouvrir la messagerie</Link>
          </article>

          <article className="home-card">
            <div className="home-card__icon">
              <img src="/folder-svgrepo-com.svg" alt="" />
            </div>
            <h3 className="home-card__title">Dossier médical</h3>
            <p className="home-card__desc">
              Visualisez votre historique médical partout, à tout moment.
            </p>
            <Link to="/pages/user/dossier" className="home-card__link">Voir mon dossier</Link>
          </article>

          <article className="home-card">
            <div className="home-card__icon">
              <img src="/assistant-ia.svg" alt="" />
            </div>
            <h3 className="home-card__title">Chatbot médical</h3>
            <p className="home-card__desc">
              Obtenez des informations de santé immédiates grâce à notre assistant.
            </p>
          </article>
        </div>
      </section>

      {/* STATS */}
      <section className="home-landing__stats">
        <div className="home-landing__section-head home-landing__section-head--center">
          <h2>Ils nous font déjà confiance</h2>
          <p>Une communauté qui grandit chaque jour.</p>
        </div>

        <div className="home-stats__grid">
          <div className="home-stat">
            <span className="home-stat__value">
              {loadingStats ? "…" : stats[0].users ?? "5 000+"}
            </span>
            <span className="home-stat__label"> Utilisateurs</span>
          </div>
          <div className="home-stat">
            <span className="home-stat__value">
              {loadingStats ? "…" : stats[0].doctors ?? "500+"}
            </span>
            <span className="home-stat__label"> Médecins</span>
          </div>
          <div className="home-stat">
            <span className="home-stat__value">
              {loadingStats ? "…" : stats[0].appointments ?? "20 000+"}
            </span>
            <span className="home-stat__label"> Rendez-vous</span>
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="home-landing__cta">
        <div className="home-landing__cta-box">
          <h3>Prêt à démarrer avec MediTech ?</h3>
          <p>Créez votre compte en 1 minute et prenez votre premier rendez-vous.</p>
          <Link to="/signup" className="home-landing__btn home-landing__btn--primary">
            Je m'inscris maintenant
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
