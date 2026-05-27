import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./reports.css";

const periods = ["Diário", "Mensal", "Anual"];

const weekData = [
  { day: "Seg.", value: 320, active: true  },
  { day: "Ter.", value: 180, active: false },
  { day: "Qua.", value: 240, active: false },
  { day: "Qui.", value: 150, active: false },
  { day: "Sex.", value: 200, active: false },
  { day: "Sab.", value: 130, active: false },
  { day: "Dom.", value: 100, active: false },
];

const categories = [
  { icon: "📺", label: "Assinaturas", value: 44.9  },
  { icon: "🏠", label: "Casa",        value: 890.0 },
  { icon: "🛍️", label: "Compras",    value: 139.9 },
];

const Reports = () => {
  const navigate = useNavigate();
  const [period, setPeriod]     = useState("Diário");
  const [mounted, setMounted]   = useState(false);
  const [activeBar, setActiveBar] = useState(0);

  useEffect(() => {
    // Dispara animação de entrada
    requestAnimationFrame(() => setMounted(true));
  }, []);

  const total = weekData.reduce((s, d) => s + d.value, 0);
  const maxVal = Math.max(...weekData.map((d) => d.value));

  const fmt = (v) =>
    v.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <div className={`rp-root${mounted ? " rp-root--in" : ""}`}>
      <div className="rp-glow rp-glow--top" />

      {/* Header */}
      <header className="rp-header">
        <button className="rp-back-btn" onClick={() => navigate("/dashboard")} aria-label="Voltar">
          ‹
        </button>
        <h1 className="rp-title">Relatórios</h1>
        <div style={{ width: 40 }} />
      </header>

      {/* Filtros de período */}
      <div className="rp-periods">
        {periods.map((p) => (
          <button
            key={p}
            className={`rp-period-btn${period === p ? " rp-period-btn--active" : ""}`}
            onClick={() => setPeriod(p)}
          >
            {p}
          </button>
        ))}
      </div>

      {/* Card do gráfico */}
      <div className={`rp-chart-card${mounted ? " rp-chart-card--in" : ""}`}>
        <span className="rp-chart-label">Total de Despesas</span>
        <h2 className="rp-chart-total">R$ {fmt(total)}</h2>

        <div className="rp-bars">
          {weekData.map((d, i) => (
            <div
              key={d.day}
              className="rp-bar-col"
              onClick={() => setActiveBar(i)}
            >
              <div className="rp-bar-track">
                <div
                  className={`rp-bar-fill${i === activeBar ? " rp-bar-fill--active" : ""}`}
                  style={{ "--h": `${(d.value / maxVal) * 100}%`, animationDelay: `${i * 60}ms` }}
                />
              </div>
              <span className={`rp-bar-day${i === activeBar ? " rp-bar-day--active" : ""}`}>
                {d.day}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Gastos por categoria */}
      <div className={`rp-section${mounted ? " rp-section--in" : ""}`}>
        <h3 className="rp-section-title">Gastos por categoria</h3>
        <div className="rp-cat-card">
          {categories.map((cat, i) => (
            <React.Fragment key={cat.label}>
              <div className="rp-cat-item">
                <span className="rp-cat-icon">{cat.icon}</span>
                <div className="rp-cat-info">
                  <span className="rp-cat-name">{cat.label}</span>
                  <span className="rp-cat-val">R$ {fmt(cat.value)}</span>
                </div>
                <span className="rp-chevron">›</span>
              </div>
              {i < categories.length - 1 && <div className="rp-divider" />}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Reports;
