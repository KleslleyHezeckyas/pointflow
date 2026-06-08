import { useState, useEffect } from "react";
import api from "../api/api";
import { useNavigate } from "react-router-dom";

export default function Login() {
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [erro, setErro] = useState("");
    const [loading, setLoading] = useState(false);
    const [particles, setParticles] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const p = Array.from({ length: 18 }, (_, i) => ({
            id: i,
            left: Math.random() * 100,
            delay: Math.random() * 4,
            duration: 3 + Math.random() * 4,
            size: 4 + Math.random() * 8,
        }));
        setParticles(p);
    }, []);

    const handleLogin = async () => {
        setLoading(true);
        setErro("");
        try {
            const res = await api.post("/auth/login", { email, senha });
            localStorage.setItem("token", res.data.token);
            localStorage.setItem("nome", res.data.nome);
            localStorage.setItem("role", res.data.role);
            navigate(res.data.role === "ADMIN" ? "/admin" : "/dashboard");
        } catch {
            setErro("Email ou senha inválidos.");
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") handleLogin();
    };

    return (
        <>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Rajdhani:wght@400;600&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        body { background: #0a0a0a; }

        @keyframes float {
          0% { transform: translateY(100vh) scale(0); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(-10vh) scale(1); opacity: 0; }
        }

        @keyframes pulse-ring {
          0% { transform: scale(0.8); opacity: 1; }
          100% { transform: scale(2); opacity: 0; }
        }

        @keyframes glow {
          0%, 100% { box-shadow: 0 0 20px #ff6a00, 0 0 40px #ff6a00, 0 0 60px #ff6a00; }
          50% { box-shadow: 0 0 30px #ff8c00, 0 0 60px #ff8c00, 0 0 90px #ff8c00; }
        }

        @keyframes scanline {
          0% { top: -10%; }
          100% { top: 110%; }
        }

        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes borderGlow {
          0%, 100% { border-color: #ff6a00; box-shadow: 0 0 8px #ff6a0066; }
          50% { border-color: #ff8c00; box-shadow: 0 0 16px #ff8c0088; }
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .login-card {
          animation: fadeInUp 0.8s ease forwards;
        }

        .input-field {
          background: rgba(255,255,255,0.05) !important;
          border: 1px solid #ff6a0055 !important;
          color: white !important;
          transition: all 0.3s ease !important;
        }

        .input-field:focus {
          outline: none !important;
          border-color: #ff6a00 !important;
          box-shadow: 0 0 12px #ff6a0066 !important;
          background: rgba(255,106,0,0.08) !important;
          animation: borderGlow 2s infinite !important;
        }

        .input-field::placeholder { color: #ffffff55 !important; }

        .btn-login {
          position: relative;
          overflow: hidden;
          transition: all 0.3s ease !important;
        }

        .btn-login:hover {
          transform: translateY(-2px) !important;
          box-shadow: 0 8px 25px #ff6a0066 !important;
        }

        .btn-login::after {
          content: '';
          position: absolute;
          top: -50%;
          left: -60%;
          width: 30%;
          height: 200%;
          background: rgba(255,255,255,0.15);
          transform: skewX(-20deg);
          transition: left 0.5s ease;
        }

        .btn-login:hover::after { left: 130%; }
      `}</style>

            <div style={styles.container}>

                {/* Partículas */}
                {particles.map((p) => (
                    <div key={p.id} style={{
                        position: "fixed",
                        left: `${p.left}%`,
                        bottom: "-10px",
                        width: p.size,
                        height: p.size,
                        borderRadius: "50%",
                        background: "radial-gradient(circle, #ff8c00, #ff6a00)",
                        animation: `float ${p.duration}s ${p.delay}s infinite linear`,
                        pointerEvents: "none",
                        zIndex: 0,
                    }} />
                ))}

                {/* Grid de fundo */}
                <div style={styles.grid} />

                {/* Card */}
                <div className="login-card" style={styles.card}>

                    {/* Scanline */}
                    <div style={styles.scanline} />

                    {/* Ícone com pulse */}
                    <div style={styles.iconWrapper}>
                        <div style={styles.pulseRing} />
                        <div style={styles.pulseRing2} />
                        <div style={styles.iconBox}>🕐</div>
                    </div>

                    <div style={styles.titleArea}>
                        <h1 style={styles.titulo}>BATE PONTO</h1>
                        <p style={styles.subtitulo}>◈ SISTEMA DE CONTROLE DE ACESSO ◈</p>
                    </div>

                    <div style={styles.divider} />

                    <div style={styles.inputGroup}>
                        <label style={styles.label}>◉ IDENTIFICAÇÃO</label>
                        <input
                            className="input-field"
                            placeholder="email@empresa.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            onKeyDown={handleKeyDown}
                            style={styles.input}
                        />
                    </div>

                    <div style={styles.inputGroup}>
                        <label style={styles.label}>◉ SENHA DE ACESSO</label>
                        <input
                            className="input-field"
                            placeholder="••••••••"
                            type="password"
                            value={senha}
                            onChange={(e) => setSenha(e.target.value)}
                            onKeyDown={handleKeyDown}
                            style={styles.input}
                        />
                    </div>

                    {erro && (
                        <div style={styles.erroBox}>
                            ⚠ {erro}
                        </div>
                    )}

                    <button
                        className="btn-login"
                        onClick={handleLogin}
                        disabled={loading}
                        style={styles.button}
                    >
                        {loading ? (
                            <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
                <span style={{ display: "inline-block", width: 18, height: 18, border: "2px solid white", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
                AUTENTICANDO...
              </span>
                        ) : "► ACESSAR SISTEMA"}
                    </button>

                    <p style={styles.footer}>🔒 CONEXÃO SEGURA · JWT ENCRYPTED</p>
                </div>
            </div>
        </>
    );
}

const styles = {
    container: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        background: "radial-gradient(ellipse at center, #1a0a00 0%, #0a0a0a 100%)",
        fontFamily: "'Rajdhani', sans-serif",
        overflow: "hidden",
        position: "relative",
    },
    grid: {
        position: "fixed",
        inset: 0,
        backgroundImage: `
      linear-gradient(rgba(255,106,0,0.05) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,106,0,0.05) 1px, transparent 1px)
    `,
        backgroundSize: "40px 40px",
        zIndex: 0,
        pointerEvents: "none",
    },
    card: {
        position: "relative",
        background: "rgba(15,10,5,0.92)",
        border: "1px solid #ff6a0044",
        borderRadius: 4,
        padding: "48px 40px",
        width: 420,
        display: "flex",
        flexDirection: "column",
        gap: 20,
        zIndex: 1,
        backdropFilter: "blur(20px)",
        boxShadow: "0 0 40px #ff6a0022, inset 0 0 40px #ff6a0008",
        overflow: "hidden",
    },
    scanline: {
        position: "absolute",
        left: 0,
        width: "100%",
        height: "2px",
        background: "linear-gradient(90deg, transparent, #ff6a0066, transparent)",
        animation: "scanline 4s linear infinite",
        pointerEvents: "none",
        zIndex: 2,
    },
    iconWrapper: {
        position: "relative",
        width: 80,
        height: 80,
        alignSelf: "center",
    },
    pulseRing: {
        position: "absolute",
        inset: 0,
        borderRadius: "50%",
        border: "2px solid #ff6a00",
        animation: "pulse-ring 2s ease-out infinite",
    },
    pulseRing2: {
        position: "absolute",
        inset: 0,
        borderRadius: "50%",
        border: "2px solid #ff8c00",
        animation: "pulse-ring 2s 1s ease-out infinite",
    },
    iconBox: {
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 32,
        background: "rgba(255,106,0,0.15)",
        borderRadius: "50%",
        border: "1px solid #ff6a0088",
        animation: "glow 3s ease-in-out infinite",
    },
    titleArea: {
        textAlign: "center",
    },
    titulo: {
        fontSize: 28,
        fontWeight: 900,
        color: "#ff6a00",
        fontFamily: "'Orbitron', sans-serif",
        letterSpacing: 6,
        textShadow: "0 0 20px #ff6a00, 0 0 40px #ff6a0066",
    },
    subtitulo: {
        fontSize: 11,
        color: "#ff8c0088",
        letterSpacing: 3,
        marginTop: 6,
    },
    divider: {
        height: 1,
        background: "linear-gradient(90deg, transparent, #ff6a0066, transparent)",
    },
    inputGroup: {
        display: "flex",
        flexDirection: "column",
        gap: 6,
    },
    label: {
        fontSize: 11,
        color: "#ff8c00",
        letterSpacing: 2,
        fontFamily: "'Orbitron', sans-serif",
    },
    input: {
        padding: "12px 16px",
        borderRadius: 4,
        fontSize: 15,
        width: "100%",
    },
    erroBox: {
        background: "rgba(255,50,50,0.1)",
        border: "1px solid #ff333366",
        borderRadius: 4,
        padding: "10px 14px",
        color: "#ff6666",
        fontSize: 13,
        letterSpacing: 1,
    },
    button: {
        padding: "14px",
        background: "linear-gradient(90deg, #ff6a00, #ff8c00)",
        color: "white",
        border: "none",
        borderRadius: 4,
        fontSize: 15,
        fontWeight: 700,
        cursor: "pointer",
        letterSpacing: 3,
        fontFamily: "'Orbitron', sans-serif",
    },
    footer: {
        textAlign: "center",
        fontSize: 10,
        color: "#ff6a0055",
        letterSpacing: 2,
    },
};