import { useState, useEffect } from "react";
import api from "../api/api";
import { useNavigate } from "react-router-dom";

export default function Admin() {
    const [registros, setRegistros] = useState([]);
    const [locais, setLocais] = useState([]);
    const [horas, setHoras] = useState([]);
    const [inicio, setInicio] = useState("");
    const [fim, setFim] = useState("");
    const [inicioHoras, setInicioHoras] = useState("");
    const [fimHoras, setFimHoras] = useState("");
    const [novoLocal, setNovoLocal] = useState({ nome: "", latitude: "", longitude: "", raioMetros: 100 });
    const [aba, setAba] = useState("relatorio");
    const navigate = useNavigate();

    useEffect(() => {
        carregarLocais();
        buscarTodos();
    }, []);

    const buscarTodos = async () => {
        const res = await api.get("/admin/relatorio", {
            params: {
                inicio: "2000-01-01T00:00:00",
                fim: "2099-12-31T23:59:59"
            }
        });
        setRegistros(res.data);
    };

    const buscarRelatorio = async () => {
        const res = await api.get("/admin/relatorio", {
            params: { inicio: inicio + ":00", fim: fim + ":00" }
        });
        setRegistros(res.data);
    };

    const buscarHoras = async () => {
        const res = await api.get("/admin/horas", {
            params: { inicio: inicioHoras + ":00", fim: fimHoras + ":00" }
        });
        setHoras(res.data.relatorio || []);
    };

    const buscarHorasTodas = async () => {
        const res = await api.get("/admin/horas", {
            params: {
                inicio: "2000-01-01T00:00:00",
                fim: "2099-12-31T23:59:59"
            }
        });
        setHoras(res.data.relatorio || []);
    };

    const carregarLocais = async () => {
        const res = await api.get("/admin/localizacoes");
        setLocais(res.data);
    };

    const adicionarLocal = async () => {
        await api.post("/admin/localizacoes", novoLocal);
        carregarLocais();
        setNovoLocal({ nome: "", latitude: "", longitude: "", raioMetros: 100 });
    };

    const deletarLocal = async (id) => {
        await api.delete(`/admin/localizacoes/${id}`);
        carregarLocais();
    };

    const logout = () => {
        localStorage.clear();
        navigate("/");
    };

    const tipoColor = {
        ENTRADA: "#00ff88",
        INTERVALO_INICIO: "#ffaa00",
        INTERVALO_FIM: "#00aaff",
        SAIDA: "#ff4444",
    };

    const tipoLabel = {
        ENTRADA: "► ENTRADA",
        INTERVALO_INICIO: "⏸ INTERVALO",
        INTERVALO_FIM: "► RETORNO",
        SAIDA: "■ SAÍDA",
    };

    return (
        <>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Rajdhani:wght@400;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #0a0a0a; }
        @keyframes glow { 0%,100%{box-shadow:0 0 10px #ff6a0055}50%{box-shadow:0 0 25px #ff6a00aa} }
        @keyframes scanline { 0%{top:-10%}100%{top:110%} }
        @keyframes fadeIn { from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)} }
        .input-admin {
          background: rgba(255,255,255,0.04) !important;
          border: 1px solid #ff6a0044 !important;
          color: white !important;
          padding: 10px 14px !important;
          border-radius: 4px !important;
          font-family: 'Rajdhani', sans-serif !important;
          font-size: 14px !important;
          transition: all 0.3s !important;
        }
        .input-admin:focus {
          outline: none !important;
          border-color: #ff6a00 !important;
          box-shadow: 0 0 10px #ff6a0044 !important;
        }
        .input-admin::placeholder { color: #ffffff44 !important; }
        .btn-aba { transition: all 0.3s !important; }
        .btn-aba:hover { background: rgba(255,106,0,0.15) !important; }
        .row-hist:hover { background: rgba(255,106,0,0.06) !important; }
      `}</style>

            <div style={styles.container}>
                <div style={styles.grid} />

                {/* Navbar */}
                <div style={styles.navbar}>
                    <span style={styles.navLogo}>🕐 BATE PONTO · ADMIN</span>
                    <button onClick={logout} style={styles.btnLogout}>⏻ SAIR</button>
                </div>

                <div style={styles.content}>

                    {/* Abas */}
                    <div style={styles.abas}>
                        {[
                            { key: "relatorio", label: "◉ REGISTROS" },
                            { key: "horas", label: "◉ HORAS TRABALHADAS" },
                            { key: "locais", label: "◉ LOCALIZAÇÕES" },
                        ].map((a) => (
                            <button
                                key={a.key}
                                className="btn-aba"
                                onClick={() => {
                                    setAba(a.key);
                                    if (a.key === "horas") buscarHorasTodas();
                                }}
                                style={{
                                    ...styles.abaBtn,
                                    borderBottom: aba === a.key ? "2px solid #ff6a00" : "2px solid transparent",
                                    color: aba === a.key ? "#ff6a00" : "#ffffff55",
                                }}
                            >
                                {a.label}
                            </button>
                        ))}
                    </div>

                    {/* Registros */}
                    {aba === "relatorio" && (
                        <div style={styles.card}>
                            <div style={styles.scanline} />
                            <h2 style={styles.cardTitle}>◈ REGISTROS DE PONTO</h2>

                            <div style={styles.filtroRow}>
                                <div style={styles.filtroGroup}>
                                    <label style={styles.label}>INÍCIO</label>
                                    <input className="input-admin" type="datetime-local"
                                           value={inicio} onChange={(e) => setInicio(e.target.value)} />
                                </div>
                                <div style={styles.filtroGroup}>
                                    <label style={styles.label}>FIM</label>
                                    <input className="input-admin" type="datetime-local"
                                           value={fim} onChange={(e) => setFim(e.target.value)} />
                                </div>
                                <button onClick={buscarRelatorio} style={styles.btnBuscar}>► FILTRAR</button>
                                <button onClick={buscarTodos} style={{ ...styles.btnBuscar, background: "rgba(255,255,255,0.1)" }}>
                                    ↺ TODOS
                                </button>
                            </div>

                            <div style={styles.tableWrapper}>
                                <table style={styles.table}>
                                    <thead>
                                    <tr>
                                        {["FUNCIONÁRIO", "DATA/HORA", "TIPO", "LOC."].map((h) => (
                                            <th key={h} style={styles.th}>{h}</th>
                                        ))}
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {registros.length === 0 ? (
                                        <tr>
                                            <td colSpan={4} style={{ ...styles.td, textAlign: "center", color: "#ffffff22" }}>
                                                Nenhum registro encontrado
                                            </td>
                                        </tr>
                                    ) : registros.map((r) => (
                                        <tr key={r.id} className="row-hist" style={{ animation: "fadeIn 0.3s ease" }}>
                                            <td style={styles.td}>{r.nomeUsuario}</td>
                                            <td style={styles.td}>{new Date(r.dataHora).toLocaleString("pt-BR")}</td>
                                            <td style={{ ...styles.td, color: tipoColor[r.tipo] || "#ff6a00", fontWeight: 600 }}>
                                                {tipoLabel[r.tipo] || r.tipo}
                                            </td>
                                            <td style={styles.td}>
                                                {r.localizacaoValida
                                                    ? <span style={{ color: "#00ff88" }}>✔</span>
                                                    : <span style={{ color: "#ff4444" }}>✘</span>}
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* Horas Trabalhadas */}
                    {aba === "horas" && (
                        <div style={styles.card}>
                            <div style={styles.scanline} />
                            <h2 style={styles.cardTitle}>◈ HORAS TRABALHADAS</h2>

                            <div style={styles.filtroRow}>
                                <div style={styles.filtroGroup}>
                                    <label style={styles.label}>INÍCIO</label>
                                    <input className="input-admin" type="datetime-local"
                                           value={inicioHoras} onChange={(e) => setInicioHoras(e.target.value)} />
                                </div>
                                <div style={styles.filtroGroup}>
                                    <label style={styles.label}>FIM</label>
                                    <input className="input-admin" type="datetime-local"
                                           value={fimHoras} onChange={(e) => setFimHoras(e.target.value)} />
                                </div>
                                <button onClick={buscarHoras} style={styles.btnBuscar}>► FILTRAR</button>
                                <button onClick={buscarHorasTodas} style={{ ...styles.btnBuscar, background: "rgba(255,255,255,0.1)" }}>
                                    ↺ TODOS
                                </button>
                            </div>

                            {horas.length === 0 ? (
                                <p style={{ color: "#ffffff33", textAlign: "center", padding: 20 }}>
                                    Nenhum registro encontrado
                                </p>
                            ) : horas.map((func, i) => (
                                <div key={i} style={styles.funcCard}>
                                    <div style={styles.funcHeader}>
                                        <span style={styles.funcNome}>👤 {func.funcionario}</span>
                                        <span style={styles.funcTotal}>
                      TOTAL: <strong style={{ color: "#ff6a00" }}>{func.totalHoras}</strong>
                    </span>
                                    </div>
                                    <div style={styles.tableWrapper}>
                                        <table style={styles.table}>
                                            <thead>
                                            <tr>
                                                {["DIA", "HORAS TRABALHADAS"].map((h) => (
                                                    <th key={h} style={styles.th}>{h}</th>
                                                ))}
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {func.dias.map((d, j) => (
                                                <tr key={j} className="row-hist">
                                                    <td style={styles.td}>
                                                        {new Date(d.dia + "T00:00:00").toLocaleDateString("pt-BR", {
                                                            weekday: "long", day: "2-digit", month: "2-digit", year: "numeric"
                                                        }).toUpperCase()}
                                                    </td>
                                                    <td style={{ ...styles.td, color: "#00ff88", fontWeight: 600, fontFamily: "'Orbitron', sans-serif" }}>
                                                        {d.horasTrabalhadas}
                                                    </td>
                                                </tr>
                                            ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Localizações */}
                    {aba === "locais" && (
                        <div style={styles.card}>
                            <div style={styles.scanline} />
                            <h2 style={styles.cardTitle}>◈ LOCALIZAÇÕES PERMITIDAS</h2>

                            <div style={styles.localForm}>
                                {[
                                    { key: "nome", placeholder: "Nome do local" },
                                    { key: "latitude", placeholder: "Latitude" },
                                    { key: "longitude", placeholder: "Longitude" },
                                    { key: "raioMetros", placeholder: "Raio (metros)" },
                                ].map((f) => (
                                    <input
                                        key={f.key}
                                        className="input-admin"
                                        placeholder={f.placeholder}
                                        value={novoLocal[f.key]}
                                        onChange={(e) => setNovoLocal({ ...novoLocal, [f.key]: e.target.value })}
                                    />
                                ))}
                                <button onClick={adicionarLocal} style={styles.btnAdicionar}>
                                    + ADICIONAR
                                </button>
                            </div>

                            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                                {locais.length === 0 ? (
                                    <p style={{ color: "#ffffff33", fontSize: 13, textAlign: "center", padding: 20 }}>
                                        Nenhuma localização cadastrada
                                    </p>
                                ) : locais.map((l) => (
                                    <div key={l.id} style={styles.localItem}>
                                        <div>
                                            <p style={{ color: "#ff8c00", fontWeight: 600 }}>{l.nome}</p>
                                            <p style={{ color: "#ffffff66", fontSize: 12 }}>
                                                {l.latitude}, {l.longitude} · Raio: {l.raioMetros}m
                                            </p>
                                        </div>
                                        <button onClick={() => deletarLocal(l.id)} style={styles.btnDeletar}>
                                            ✘ REMOVER
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
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
    navLogo: {
        fontFamily: "'Orbitron', sans-serif",
        fontSize: 15,
        fontWeight: 900,
        color: "#ff6a00",
        textShadow: "0 0 15px #ff6a00",
        letterSpacing: 3,
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
    },
    content: {
        maxWidth: 960,
        margin: "0 auto",
        padding: "32px 20px",
        position: "relative",
        zIndex: 1,
        display: "flex",
        flexDirection: "column",
        gap: 24,
    },
    abas: {
        display: "flex",
        gap: 0,
        borderBottom: "1px solid #ff6a0022",
        flexWrap: "wrap",
    },
    abaBtn: {
        background: "transparent",
        border: "none",
        padding: "14px 24px",
        cursor: "pointer",
        fontFamily: "'Orbitron', sans-serif",
        fontSize: 12,
        letterSpacing: 2,
        transition: "all 0.3s",
    },
    card: {
        position: "relative",
        background: "rgba(255,106,0,0.03)",
        border: "1px solid #ff6a0022",
        borderRadius: 4,
        padding: "32px",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        gap: 20,
        animation: "glow 4s ease-in-out infinite",
    },
    scanline: {
        position: "absolute",
        left: 0,
        width: "100%",
        height: "2px",
        background: "linear-gradient(90deg, transparent, #ff6a0033, transparent)",
        animation: "scanline 6s linear infinite",
    },
    cardTitle: {
        fontFamily: "'Orbitron', sans-serif",
        fontSize: 14,
        color: "#ff8c00",
        letterSpacing: 3,
    },
    filtroRow: {
        display: "flex",
        gap: 12,
        alignItems: "flex-end",
        flexWrap: "wrap",
    },
    filtroGroup: {
        display: "flex",
        flexDirection: "column",
        gap: 6,
        flex: 1,
        minWidth: 180,
    },
    label: {
        fontFamily: "'Orbitron', sans-serif",
        fontSize: 10,
        color: "#ff8c00",
        letterSpacing: 2,
    },
    btnBuscar: {
        padding: "10px 24px",
        background: "linear-gradient(90deg, #ff6a00, #ff8c00)",
        border: "none",
        borderRadius: 4,
        color: "white",
        fontFamily: "'Orbitron', sans-serif",
        fontSize: 12,
        letterSpacing: 2,
        cursor: "pointer",
        whiteSpace: "nowrap",
    },
    tableWrapper: {
        background: "rgba(255,255,255,0.02)",
        border: "1px solid #ff6a0022",
        borderRadius: 4,
        overflow: "auto",
    },
    table: { width: "100%", borderCollapse: "collapse" },
    th: {
        padding: "12px 16px",
        textAlign: "left",
        fontFamily: "'Orbitron', sans-serif",
        fontSize: 10,
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
    },
    funcCard: {
        background: "rgba(255,255,255,0.02)",
        border: "1px solid #ff6a0022",
        borderRadius: 4,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        gap: 0,
    },
    funcHeader: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "14px 18px",
        background: "rgba(255,106,0,0.08)",
        borderBottom: "1px solid #ff6a0022",
    },
    funcNome: {
        fontFamily: "'Orbitron', sans-serif",
        fontSize: 13,
        color: "#ff8c00",
        letterSpacing: 2,
    },
    funcTotal: {
        fontSize: 14,
        color: "#ffffffaa",
        letterSpacing: 1,
    },
    localForm: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
        gap: 10,
        alignItems: "end",
    },
    btnAdicionar: {
        padding: "10px 16px",
        background: "linear-gradient(90deg, #ff6a00, #ff8c00)",
        border: "none",
        borderRadius: 4,
        color: "white",
        fontFamily: "'Orbitron', sans-serif",
        fontSize: 11,
        letterSpacing: 2,
        cursor: "pointer",
    },
    localItem: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "14px 18px",
        background: "rgba(255,255,255,0.03)",
        border: "1px solid #ff6a0022",
        borderRadius: 4,
    },
    btnDeletar: {
        background: "transparent",
        border: "1px solid #ff444455",
        color: "#ff4444",
        padding: "6px 14px",
        borderRadius: 4,
        cursor: "pointer",
        fontFamily: "'Orbitron', sans-serif",
        fontSize: 10,
        letterSpacing: 2,
    },
};