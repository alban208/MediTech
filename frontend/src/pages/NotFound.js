const NotFound = () => {
    return (
        <div className="not-found" style={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            background: "linear-gradient(135deg, #f8fafc 0%, #e0e7ff 100%)",
            padding: "2rem"
        }}>
            <h1 style={{
                color: "#3b82f6",
                fontSize: "2.5rem",
                marginBottom: "1.5rem",
                textAlign: "center",
                fontWeight: "700"
            }}>
                {"Oups ! 😢​ Page introuvable."}
            </h1>
            <img
                src="/erreur-404.png"
                alt="Erreur 404"
                style={{
                    maxWidth: "350px",
                    width: "100%",
                    height: "auto",
                    marginBottom: "2rem",
                    boxShadow: "0 4px 24px rgba(59,130,246,0.12)",
                    borderRadius: "1rem"
                }}
            />
            <a
                href="/"
                style={{
                    padding: "0.75rem 1.5rem",
                    background: "#3b82f6",
                    color: "#fff",
                    borderRadius: "0.5rem",
                    textDecoration: "none",
                    fontWeight: "600",
                    boxShadow: "0 2px 8px rgba(59,130,246,0.08)",
                    transition: "background 0.2s"
                }}
                onMouseOver={e => e.currentTarget.style.background = "#2563eb"}
                onMouseOut={e => e.currentTarget.style.background = "#3b82f6"}
            >
                Retour à l'accueil
            </a>
        </div>
    )
}

export default NotFound;