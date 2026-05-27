import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./dashboard.css";

const transactions = [
  { id: 1, icon: "📺", label: "Assinatura Netflix", value: -44.9 },
  { id: 2, icon: "🏠", label: "Aluguel ap",         value: -890.0 },
  { id: 3, icon: "💐", label: "Buquê de flores",    value: -139.9 },
];

const navItems = [
  { icon: "🏠", label: "Início",     path: "/dashboard" },
  { icon: "📊", label: "Relatórios", path: "/reports"   },
  { icon: "💳", label: "Carteiras",  path: "/wallets"   },
  { icon: "🎯", label: "Metas",      path: "/goals"     },
  { icon: "⚙️", label: "Config",    path: "/settings"  },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const [balanceVisible, setBalanceVisible] = useState(true);
  const [fabOpen, setFabOpen] = useState(false);

  const fmt = (v) =>
    Math.abs(v).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  const totalBalance = 11973.0;
  const receitas     = 4307.0;
  const despesas     = 2394.0;
  const saldo        = receitas - despesas;

  return (
    <div className="db-root">
      <div className="db-glow db-glow--top" />
      <div className="db-glow db-glow--bottom" />

      {/* ── Sidebar ── */}
      <aside className="db-sidebar">
        {navItems.map((item) => (
          <button
            key={item.label}
            className={`db-sidebar-item${item.path === "/dashboard" ? " db-sidebar-item--active" : ""}`}
            onClick={() => navigate(item.path)}
          >
            <span className="db-sidebar-ico">{item.icon}</span>
            {item.label}
          </button>
        ))}
        <div className="db-sidebar-spacer" />
        <div className="db-sidebar-user">
          <div className="db-sidebar-avatar" />
          <div className="db-sidebar-user-info">
            <span className="db-sidebar-user-name">Juninho</span>
            <span className="db-sidebar-user-role">Conta pessoal</span>
          </div>
        </div>
      </aside>

      {/* ── Main ── */}
      <main className="db-main">
        <header className="db-header">
          <div className="db-avatar" />
          <div className="db-greeting">
            <span className="db-greeting-name">Olá, Juninho 👋</span>
            <span className="db-greeting-sub">bem-vinda de volta!</span>
          </div>
          <button className="db-notif-btn" aria-label="Notificações">🔔</button>
        </header>

        <section className="db-balance-section">
          <span className="db-balance-label">Saldo Total</span>
          <div className="db-balance-row">
            <h1 className="db-balance-value">
              {balanceVisible
                ? `R$ ${totalBalance.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`
                : "R$ ••••••"}
            </h1>
            <button
              className="db-balance-toggle"
              onClick={() => setBalanceVisible((v) => !v)}
              aria-label="Mostrar/ocultar saldo"
            >
              {balanceVisible ? "👁" : "🙈"}
            </button>
          </div>
          <div className="db-balance-trend">
            <span>↗</span> +12,5% vs mês passado
          </div>
        </section>

        <div className="db-grid">
          <section className="db-card db-summary">
            <h2 className="db-section-title">Resumo do mês</h2>
            <div className="db-summary-list">
              <div className="db-summary-item">
                <span className="db-summary-ico db-summary-ico--green">📈</span>
                <div className="db-summary-info">
                  <span className="db-summary-name">Receitas</span>
                  <span className="db-summary-val db-summary-val--green">{fmt(receitas)}</span>
                </div>
                <span className="db-chevron">›</span>
              </div>
              <div className="db-divider" />
              <div className="db-summary-item">
                <span className="db-summary-ico db-summary-ico--red">📉</span>
                <div className="db-summary-info">
                  <span className="db-summary-name">Despesas</span>
                  <span className="db-summary-val db-summary-val--red">{fmt(despesas)}</span>
                </div>
                <span className="db-chevron">›</span>
              </div>
              <div className="db-divider" />
              <div className="db-summary-item">
                <span className="db-summary-ico db-summary-ico--purple">💳</span>
                <div className="db-summary-info">
                  <span className="db-summary-name">Saldo</span>
                  <span className="db-summary-val">{fmt(saldo)}</span>
                </div>
                <span className="db-chevron">›</span>
              </div>
            </div>
          </section>

          <section className="db-card db-transactions">
            <h2 className="db-section-title">Ultimas despesas</h2>
            <div className="db-tx-list">
              {transactions.map((tx) => (
                <div key={tx.id} className="db-tx-item">
                  <span className="db-tx-icon">{tx.icon}</span>
                  <div className="db-tx-info">
                    <span className="db-tx-name">{tx.label}</span>
                    <span className="db-tx-val">-{fmt(tx.value)}</span>
                  </div>
                  <span className="db-chevron">›</span>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>

      {/* Overlay */}
      {fabOpen && (
        <div className="db-fab-overlay" onClick={() => setFabOpen(false)} />
      )}

      {/* Bottom Nav mobile */}
      <nav className="db-nav">
        <button className="db-nav-btn db-nav-btn--active" onClick={() => navigate("/dashboard")}>
          <span className="db-nav-ico">🏠</span>
          <span className="db-nav-label">Início</span>
        </button>
        <button className="db-nav-btn" onClick={() => navigate("/reports")}>
          <span className="db-nav-ico">📊</span>
        </button>

        <div className="db-fab-wrapper">
          {fabOpen && (
            <div className="db-fab-menu">
              <button
                className="db-fab-option"
                onClick={() => { setFabOpen(false); navigate("/newexpense"); }}
              >
                Adicionar Despesa
              </button>
              <button
                className="db-fab-option"
                onClick={() => { setFabOpen(false); navigate("/newitem"); }}
              >
                Adicionar Item
              </button>
            </div>
          )}
          <button
            className={`db-nav-fab${fabOpen ? " db-nav-fab--open" : ""}`}
            onClick={() => setFabOpen((v) => !v)}
            aria-label="Adicionar"
          >
            +
          </button>
        </div>

        <button className="db-nav-btn" onClick={() => navigate("/profile")}>
          <span className="db-nav-ico">👤</span>
        </button>
        <button className="db-nav-btn" onClick={() => navigate("/settings")}>
          <span className="db-nav-ico">⚙️</span>
        </button>
      </nav>
    </div>
  );
};

export default Dashboard;
