import { useNavigate } from 'react-router-dom'
import './settings.css'
import BottomNav from '../BottomNav'

export default function Settings() {
  const navigate = useNavigate()

  const menuItems = [
    { label: 'Editar perfil', icon: 'user', action: () => {} },
    { label: 'Notificações', icon: 'bell', action: () => {} },
    { label: 'Privacidade', icon: 'shield', action: () => {} },
    { label: 'Termos de uso', icon: 'file', action: () => {} },
    { label: 'Sair', icon: 'logout', action: () => navigate('/login'), danger: true },
  ]

  const getIcon = (type) => {
    const icons = {
      user: (
        <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" stroke="currentColor" />
          <circle cx="12" cy="7" r="4" stroke="currentColor" />
        </svg>
      ),
      bell: (
        <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" stroke="currentColor" />
          <path d="M13.73 21a2 2 0 01-3.46 0" stroke="currentColor" />
        </svg>
      ),
      shield: (
        <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" />
        </svg>
      ),
      file: (
        <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" stroke="currentColor" />
          <polyline points="14 2 14 8 20 8" stroke="currentColor" />
        </svg>
      ),
      logout: (
        <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" stroke="currentColor" />
          <polyline points="16 17 21 12 16 7" stroke="currentColor" />
          <line x1="21" y1="12" x2="9" y2="12" stroke="currentColor" />
        </svg>
      ),
    }
    return icons[type] || icons.user
  }

  return (
    <div className="st-root">
      {/* ── decorações ── */}
      <div className="st-deco" aria-hidden="true">
        <div className="st-deco__orb" />
      </div>

      <div className="st-shell">
        {/* ── header ── */}
        <header className="st-header">
          <button
            className="st-header__back"
            onClick={() => navigate('/dashboard')}
            aria-label="Voltar"
          >
            <svg viewBox="0 0 24 24" fill="none" strokeWidth="2.5" aria-hidden="true">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <h1 className="st-header__title">Configurações</h1>
        </header>

        {/* ── perfil resumo ── */}
        <div className="st-profile">
          <div className="st-profile__avatar">
            <span>J</span>
          </div>
          <div className="st-profile__info">
            <span className="st-profile__name">Juninho</span>
            <span className="st-profile__email">juninho@email.com</span>
          </div>
        </div>

        {/* ── menu ── */}
        <nav className="st-menu">
          {menuItems.map((item) => (
            <button
              key={item.label}
              className={`st-menu-item${item.danger ? ' st-menu-item--danger' : ''}`}
              onClick={item.action}
            >
              <span className="st-menu-item__icon">{getIcon(item.icon)}</span>
              <span className="st-menu-item__label">{item.label}</span>
              <svg className="st-menu-item__arrow" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6" stroke="currentColor" />
              </svg>
            </button>
          ))}
        </nav>

        {/* spacer */}
        <div className="st-spacer" />
      </div>

      {/* ── bottom navigation ── */}
      <BottomNav active="settings" />
    </div>
  )
}
