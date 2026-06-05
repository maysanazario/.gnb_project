import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./dashboard.css";

const transactions = [
  { id: 1, icon: "📺", label: "Assinatura Netflix", value: -44.9 },
  { id: 2, icon: "🏠", label: "Aluguel ap", value: -890.0 },
  { id: 3, icon: "🛒", label: "Buquê de flores", value: -139.9 },
];

const navItems = [
  { icon: "🏠", label: "Início",      path: "/dashboard" },
  { icon: "📊", label: "Relatórios",  path: "/reports"   },
  { icon: "💳", label: "Carteiras",   path: "/wallets"   },
  { icon: "👑", label: "Rei do Troco",path: "/chatbot"   },
  { icon: "⚙️", label: "Config",     path: "/settings"  },
];

/* ── SVG icons ── */
const HomeIcon    = ({ active }) => <svg width="22" height="22" viewBox="0 0 24 24" fill={active ? "#a259ff" : "#6b7280"}><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>;
const ChartIcon   = ({ active }) => <svg width="22" height="22" viewBox="0 0 24 24"><rect x="18" y="3"  width="3" height="18" rx="1" fill={active ? "#a259ff" : "#6b7280"}/><rect x="10.5" y="8"  width="3" height="13" rx="1" fill={active ? "#a259ff" : "#6b7280"}/><rect x="3"  y="13" width="3" height="8"  rx="1" fill={active ? "#a259ff" : "#6b7280"}/></svg>;
const CrownIcon   = ({ active }) => <svg width="22" height="22" viewBox="0 0 24 24" fill={active ? "#a259ff" : "#6b7280"}><path d="M2 19l2-9 5 4 3-7 3 7 5-4 2 9H2zm0 2h20v2H2v-2z"/></svg>;
const PersonIcon  = ({ active }) => <svg width="22" height="22" viewBox="0 0 24 24" fill={active ? "#a259ff" : "#6b7280"}><path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/></svg>;
const GearIcon    = ({ active }) => <svg width="22" height="22" viewBox="0 0 24 24" fill={active ? "#a259ff" : "#6b7280"}><path d="M19.14 12.94c.04-.3.06-.61.06-.94s-.02-.64-.07-.94l2.03-1.58a.49.49 0 0 0 .12-.61l-1.92-3.32a.49.49 0 0 0-.59-.22l-2.39.96a7.01 7.01 0 0 0-1.62-.94l-.36-2.54a.484.484 0 0 0-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96a.48.48 0 0 0-.59.22L2.74 8.87a.47.47 0 0 0 .12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58a.49.49 0 0 0-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32a.47.47 0 0 0-.12-.61l-2.01-1.58zM12 15.6a3.6 3.6 0 1 1 0-7.2 3.6 3.6 0 0 1 0 7.2z"/></svg>;
const ChevronRight = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>;
const UpTrendIcon  = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#a259ff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>;
const ReceiptIcon  = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#a259ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>;
const ArrowDownIcon= () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#a259ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/></svg>;
const WalletIcon   = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#a259ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M16 12h2"/><path d="M2 10h20"/></svg>;
const EyeIcon      = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>;
const EyeOffIcon   = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>;
const StarIcon     = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>;

const Dashboard = () => {
  const navigate = useNavigate();
  const [balanceVisible, setBalanceVisible] = useState(true);
  const [fabOpen, setFabOpen] = useState(false);
  const [activePath, setActivePath] = useState("/dashboard");

  const fmt = (v) => Math.abs(v).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  const totalBalance = 11973.0;
  const receitas     = 4307.0;
  const despesas     = 2394.0;
  const saldo        = receitas - despesas;

  const handleNav = (path) => { setActivePath(path); navigate(path); };

  return (
    <div className="db-root">
      <div className="db-glow db-glow--top-right" />
      <div className="db-glow db-glow--bottom-left" />

      {/* ── Sidebar (desktop) ── */}
      <aside className="db-sidebar">
        <span className="db-sidebar-logo">.GNB</span>
        {navItems.map((item) => (
          <button
            key={item.label}
            className={`db-sidebar-item${activePath === item.path ? " db-sidebar-item--active" : ""}`}
            onClick={() => handleNav(item.path)}
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
        {/* Header */}
        <header className="db-header">
          <div className="db-header-left">
            <div className="db-avatar"><span>J</span></div>
            <div className="db-greeting">
              <span className="db-greeting-name">Olá, Juninho 👋</span>
              <span className="db-greeting-sub">bem-vinda de volta!</span>
            </div>
          </div>
          <button className="db-notif-btn" aria-label="WishList" onClick={() => navigate("/wishlist")}>
            <StarIcon />
          </button>
        </header>

        {/* Balance */}
        <section className="db-balance-section">
          <span className="db-balance-label">Saldo Total</span>
          <div className="db-balance-row">
            <h1 className="db-balance-value">
              {balanceVisible
                ? `R$ ${totalBalance.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`
                : "R$ ••••••"}
            </h1>
            <button className="db-balance-toggle" onClick={() => setBalanceVisible((v) => !v)} aria-label="Mostrar/ocultar saldo">
              {balanceVisible ? <EyeIcon /> : <EyeOffIcon />}
            </button>
          </div>
          <div className="db-balance-trend">
            <UpTrendIcon />
            <span>+12,5% vs mês passado</span>
          </div>
        </section>

        {/* Two-column grid on desktop */}
        <div className="db-grid">
          {/* Resumo do mês */}
          <section className="db-section">
            <h2 className="db-section-title">Resumo do mês</h2>
            <div className="db-card">
              <div className="db-summary-item" onClick={() => navigate("/reports")}>
                <span className="db-summary-ico"><ReceiptIcon /></span>
                <div className="db-summary-info">
                  <span className="db-summary-name">Receitas</span>
                  <span className="db-summary-val db-summary-val--green">{fmt(receitas)}</span>
                </div>
                <ChevronRight />
              </div>
              <div className="db-divider" />
              <div className="db-summary-item" onClick={() => navigate("/reports")}>
                <span className="db-summary-ico"><ArrowDownIcon /></span>
                <div className="db-summary-info">
                  <span className="db-summary-name">Despesas</span>
                  <span className="db-summary-val db-summary-val--red">{fmt(despesas)}</span>
                </div>
                <ChevronRight />
              </div>
              <div className="db-divider" />
              <div className="db-summary-item" onClick={() => navigate("/wallets")}>
                <span className="db-summary-ico"><WalletIcon /></span>
                <div className="db-summary-info">
                  <span className="db-summary-name">Saldo</span>
                  <span className="db-summary-val">{fmt(saldo)}</span>
                </div>
                <ChevronRight />
              </div>
            </div>
          </section>

          {/* Últimas despesas */}
          <section className="db-section">
            <h2 className="db-section-title">Ultimas despesas</h2>
            <div className="db-card">
              {transactions.map((tx, idx) => (
                <React.Fragment key={tx.id}>
                  <div className="db-tx-item">
                    <span className="db-tx-icon">{tx.icon}</span>
                    <div className="db-tx-info">
                      <span className="db-tx-name">{tx.label}</span>
                      <span className="db-tx-val">{fmt(tx.value)}</span>
                    </div>
                    <ChevronRight />
                  </div>
                  {idx < transactions.length - 1 && <div className="db-divider" />}
                </React.Fragment>
              ))}
            </div>
          </section>
        </div>

        <div style={{ height: "90px" }} />
      </main>

      {/* FAB overlay */}
      {fabOpen && <div className="db-fab-overlay" onClick={() => setFabOpen(false)} />}

      {/* FAB menu */}
      {fabOpen && (
        <div className="db-fab-menu">
          <button className="db-fab-option" onClick={() => { setFabOpen(false); navigate("/newexpense"); }}>Adicionar Despesa</button>
          <button className="db-fab-option" onClick={() => { setFabOpen(false); navigate("/newitem"); }}>Adicionar Item</button>
        </div>
      )}

      {/* Bottom Nav (mobile) */}
      <nav className="db-nav">
        <button className={`db-nav-btn${activePath === "/dashboard" ? " db-nav-btn--active" : ""}`} onClick={() => handleNav("/dashboard")}>
          <HomeIcon active={activePath === "/dashboard"} />
          <span className="db-nav-label">Início</span>
        </button>
        <button className={`db-nav-btn${activePath === "/reports" ? " db-nav-btn--active" : ""}`} onClick={() => handleNav("/reports")}>
          <ChartIcon active={activePath === "/reports"} />
        </button>
        <button className={`db-nav-fab${fabOpen ? " db-nav-fab--open" : ""}`} onClick={() => setFabOpen((v) => !v)} aria-label="Adicionar">
          <span className="db-fab-plus">{fabOpen ? "×" : "+"}</span>
        </button>
        <button className={`db-nav-btn${activePath === "/chatbot" ? " db-nav-btn--active" : ""}`} onClick={() => handleNav("/chatbot")}>
          <CrownIcon active={activePath === "/chatbot"} />
        </button>
        <button className={`db-nav-btn${activePath === "/settings" ? " db-nav-btn--active" : ""}`} onClick={() => handleNav("/settings")}>
          <GearIcon active={activePath === "/settings"} />
        </button>
      </nav>
    </div>
  );
};

export default Dashboard;