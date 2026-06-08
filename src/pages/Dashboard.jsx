import { useState, useEffect } from "react";
import api from "../api/api";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
    const [historico, setHistorico] = useState([]);
    const [status, setStatus] = useState("");
    const [statusTipo, setStatusTipo] = useState("");
    const [loading, setLoading] = useState(false);
    const [horaAtual, setHoraAtual] = useState(new Date());
    const nome = localStorage.getItem("nome");
    const navigate = useNavigate();

    useEffect(() => {
        carregarHistorico();
        const timer = setInterval(() => setHoraAtual(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const carregarHistorico = async () => {
        const res = await api.get("/ponto/historico");
        setHistorico(res.data);
    };

    const registrarPonto = async (tipo) => {
        setLoading(true);
        if (!navigator.geolocation) {
            setStatus("GPS não suportado pelo navegador.");
            setStatusTipo("erro");
            setLoading(false);
            return;
        }
        navigator.geolocation.getCurrentPosition(async (pos) => {
            try {
                const res = await api.post("/ponto/registrar", {
                    latitude: pos.coords.latitude,
                    longitude: pos.coords.longitude,
                    tipo,
                });
                setStatus(res.data.localizacaoValida
                    ? "✔ Ponto registrado com sucesso!"
                    : "⚠ Ponto registrado fora da localização permitida.");
                setStatusTipo(res.data.localizacaoValida ? "ok" : "aviso");
                carregarHistorico();
            } catch {
                setStatus("✘ Erro ao registrar ponto.");
                setStatusTipo("erro");
            } finally {
                setLoading(false);
            }
        }, () => {
            setStatus("✘ Não foi possível obter localização.");
            setStatusTipo("erro");
            setLoading(false);
        });
    };

    const logout = () => {
        localStorage.clear();
        navigate("/");
    };

    const tipoLabel = {
        ENTRADA: "► ENTRADA",
        INTERVALO_INICIO: "⏸ INTERVALO",
        INTERVALO_FIM: "► RETORNO",
        SAIDA: "■ SAÍDA",
    };

    const tipoColor = {
        ENTRADA: "#00ff88",
        INTERVALO_INICIO: "#ffaa00",
        INTERVALO_FIM: "#00aaff",
        SAIDA: "#ff4444",
    };

    return (
        <>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Rajdhani:wght@400;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #0a0a0a; }

        @keyframes glow {
          0%, 100% { box-shadow: 0 0 10px #ff6a0066; }
          50% { box-shadow: 0 0 25px #ff6a00aa; }
        }
        @keyframes scanline {
          0% { top: -10%; }
          100% { top: 110%; }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        .btn-ponto {
          transition: all 0.3s ease !important;
          position: relative;
          overflow: hidden;
        }
        .btn-ponto:hover {
          transform: translateY(-3px) !important;
          filter: brightness(1.2) !important;
        }
        .row-hist:hover {
          background: rgba(255,106,0,0.08) !important;
        }
      `}</style>

            <div style={styles.container}>
                <div style={styles.grid} />

                {/* Navbar */}
                <div style={styles.navbar}>
                    <div style={styles.navLeft}>
                        <span style={styles.navLogo}>🕐 BATE PONTO</span>
                        <span style={styles.navDot}>◈</span>
                        <span style={styles.navUser}>OLÁ, {nome?.toUpperCase()}</span>
                    </div>
                    <div style={styles.navRight}>
            <span style={styles.horaDisplay}>
              {horaAtual.toLocaleTimeString("pt-BR")}
            </span>
                        <button onClick={logout} style={styles.btnLogout}>
                            ⏻ SAIR
                        </button>
                    </div>
                </div>

                <div style={styles.content}>

                    {/* Card relógio */}
                    <div style={styles.clockCard}>
                        <div style={styles.scanline} />
                        <p style={styles.dataLabel}>
                            {horaAtual.toLocaleDateString("pt-BR", {
                                weekday: "long", day: "2-digit", month: "long", year: "numeric"
                            }).toUpperCase()}
                        </p>
                        <p style={styles.clockBig}>
                            {horaAtual.toLocaleTimeString("pt-BR")}
                        </p>
                        <p style={styles.clockSub}>◈ HORA DO SISTEMA ◈</p>
                    </div>

                    {/* Botões de ponto */}
                    <div style={styles.section}>
                        <h2 style={styles.sectionTitle}>◉ REGISTRAR PONTO</h2>
                        <div style={styles.botoesGrid}>
                            {["ENTRADA", "INTERVALO_INICIO", "INTERVALO_FIM", "SAIDA"].map((tipo) => (
                                <button
                                    key={tipo}
                                    className="btn-ponto"
                                    onClick={() => registrarPonto(tipo)}
                                    disabled={loading}
                                    style={{
                                        ...styles.btnPonto,
                                        borderColor: tipoColor[tipo] + "88",
                                        color: tipoColor[tipo],
                                        boxShadow: `0 0 12px ${tipoColor[tipo]}33`,
                                    }}
                                >
                                    {loading ? "..." : tipoLabel[tipo]}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Status */}
                    {status && (
                        <div style={{
                            ...styles.statusBox,
                            borderColor: statusTipo === "ok" ? "#00ff8888"
                                : statusTipo === "aviso" ? "#ffaa0088" : "#ff444488",
                            color: statusTipo === "ok" ? "#00ff88"
                                : statusTipo === "aviso" ? "#ffaa00" : "#ff4444",
                            background: statusTipo === "ok" ? "rgba(0,255,136,0.05)"
                                : statusTipo === "aviso" ? "rgba(255,170,0,0.05)" : "rgba(255,68,68,0.05)",
                        }}>
                            {status}
                        </div>
                    )}

                    {/* Histórico */}
                    <div style={styles.section}>
                        <h2 style={styles.sectionTitle}>◉ HISTÓRICO DE PONTOS</h2>
                        <div style={styles.tableWrapper}>
                            <table style={styles.table}>
                                <thead>
                                <tr>
                                    {["DATA/HORA", "TIPO", "LOCALIZAÇÃO"].map((h) => (
                                        <th key={h} style={styles.th}>{h}</th>
                                    ))}
                                </tr>
                                </thead>
                                <tbody>
                                {historico.length === 0 ? (
                                    <tr>
                                        <td colSpan={3} style={{ ...styles.td, textAlign: "center", color: "#ffffff33" }}>
                                            Nenhum registro encontrado
                                        </td>
                                    </tr>
                                ) : historico.map((r) => (
                                    <tr key={r.id} className="row-hist" style={{ animation: "fadeIn 0.3s ease" }}>
                                        <td style={styles.td}>
                                            {new Date(r.dataHora).toLocaleString("pt-BR")}
                                        </td>
                                        <td style={{ ...styles.td, color: tipoColor[r.tipo] || "#ff6a00", fontWeight: 600 }}>
                                            {tipoLabel[r.tipo] || r.tipo}
                                        </td>
                                        <td style={styles.td}>
                                            {r.localizacaoValida
                                                ? <span style={{ color: "#00ff88" }}>✔ VÁLIDA</span>
                                                : <span style={{ color: "#ff4444" }}>✘ INVÁLIDA</span>}
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                </div>
            </div>
        </>
    );
}

const styles = {
    container: {
        minHeight: "100vh",
        background: "radial-gradient(ellipse at top, #1a0a00, #0a0a0a)",
        fontFamily: "'Rajdhani', sans-serif",
        color: "white",
    },
    grid: {
        position: "fixed",
        inset: 0,
        backgroundImage: `
      linear-gradient(rgba(255,106,0,0.04) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,106,0,0.04) 1px, transparent 1px)
    `,
        backgroundSize: "40px 40px",
        zIndex: 0,
        pointerEvents: "none",
    },
    navbar: {
        position: "sticky",
        top: 0,
        zIndex: 100,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "16px 32px",
        background: "rgba(10,5,0,0.95)",
        borderBottom: "1px solid #ff6a0033",
        backdropFilter: "blur(10px)",
    },
    navLeft: { display: "flex", alignItems: "center", gap: 12 },
    navLogo: {
        fontFamily: "'Orbitron', sans-serif",
        fontSize: 16,
        fontWeight: 900,
        color: "#ff6a00",
        textShadow: "0 0 15px #ff6a00",
        letterSpacing: 3,
    },
    navDot: { color: "#ff6a0055", fontSize: 12 },
    navUser: { color: "#ff8c00", fontSize: 13, letterSpacing: 2 },
    navRight: { display: "flex", alignItems: "center", gap: 20 },
    horaDisplay: {
        fontFamily: "'Orbitron', sans-serif",
        fontSize: 18,
        color: "#ff6a00",
        textShadow: "0 0 10px #ff6a0088",
        letterSpacing: 2,
    },
    btnLogout: {
        background: "transparent",
        border: "1px solid #ff444466",
        color: "#ff4444",
        padding: "8px 16px",
        borderRadius: 4,
        cursor: "pointer",
        fontFamily: "'Orbitron', sans-serif",
        fontSize: 11,
        letterSpacing: 2,
        transition: "all 0.3s",
    },
    content: {
        maxWidth: 900,
        margin: "0 auto",
        padding: "32px 20px",
        position: "relative",
        zIndex: 1,
        display: "flex",
        flexDirection: "column",
        gap: 28,
    },
    clockCard: {
        position: "relative",
        background: "rgba(255,106,0,0.05)",
        border: "1px solid #ff6a0033",
        borderRadius: 4,
        padding: "32px",
        textAlign: "center",
        overflow: "hidden",
        animation: "glow 3s ease-in-out infinite",
    },
    scanline: {
        position: "absolute",
        left: 0,
        width: "100%",
        height: "2px",
        background: "linear-gradient(90deg, transparent, #ff6a0044, transparent)",
        animation: "scanline 5s linear infinite",
    },
    dataLabel: {
        fontSize: 12,
        color: "#ff8c0088",
        letterSpacing: 3,
        marginBottom: 8,
    },
    clockBig: {
        fontFamily: "'Orbitron', sans-serif",
        fontSize: 52,
        fontWeight: 900,
        color: "#ff6a00",
        textShadow: "0 0 30px #ff6a00, 0 0 60px #ff6a0066",
        letterSpacing: 4,
    },
    clockSub: {
        fontSize: 11,
        color: "#ff6a0055",
        letterSpacing: 4,
        marginTop: 8,
    },
    section: {
        display: "flex",
        flexDirection: "column",
        gap: 16,
    },
    sectionTitle: {
        fontFamily: "'Orbitron', sans-serif",
        fontSize: 13,
        color: "#ff8c00",
        letterSpacing: 3,
        borderBottom: "1px solid #ff6a0033",
        paddingBottom: 10,
    },
    botoesGrid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
        gap: 12,
    },
    btnPonto: {
        padding: "18px",
        background: "rgba(255,255,255,0.03)",
        border: "1px solid",
        borderRadius: 4,
        fontSize: 14,
        fontWeight: 700,
        cursor: "pointer",
        fontFamily: "'Orbitron', sans-serif",
        letterSpacing: 2,
    },
    statusBox: {
        padding: "14px 18px",
        border: "1px solid",
        borderRadius: 4,
        fontSize: 14,
        letterSpacing: 1,
    },
    tableWrapper: {
        background: "rgba(255,255,255,0.02)",
        border: "1px solid #ff6a0022",
        borderRadius: 4,
        overflow: "hidden",
    },
    table: { width: "100%", borderCollapse: "collapse" },
    th: {
        padding: "12px 16px",
        textAlign: "left",
        fontFamily: "'Orbitron', sans-serif",
        fontSize: 11,
        color: "#ff8c00",
        letterSpacing: 2,
        background: "rgba(255,106,0,0.08)",
        borderBottom: "1px solid #ff6a0033",
    },
    td: {
        padding: "12px 16px",
        fontSize: 14,
        color: "#ffffffcc",
        borderBottom: "1px solid #ffffff08",
        transition: "background 0.2s",
    },
};