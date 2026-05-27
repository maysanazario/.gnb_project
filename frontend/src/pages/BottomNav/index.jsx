import { useNavigate, useLocation } from 'react-router-dom'
import './bottomnav.css'

/* ── ÍCONES SVG — sem texto, apenas ícones visuais ── */

const IconHome = ({ active }) => (
  <svg viewBox="0 0 24 24" fill="none" strokeWidth={active ? 2.2 : 1.6} strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" stroke="currentColor" />
    <polyline points="9 22 9 12 15 12 15 22" stroke="currentColor" />
  </svg>
)

const IconReports = ({ active }) => (
  <svg viewBox="0 0 24 24" fill="none" strokeWidth={active ? 2.2 : 1.6} strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="20" x2="18" y2="10" stroke="currentColor" />
    <line x1="12" y1="20" x2="12" y2="4" stroke="currentColor" />
    <line x1="6" y1="20" x2="6" y2="14" stroke="currentColor" />
  </svg>
)

const IconWishlist = ({ active }) => (
  <svg viewBox="0 0 24 24" fill={active ? "currentColor" : "none"} strokeWidth={active ? 2.2 : 1.6} strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" stroke="currentColor" />
  </svg>
)

const IconAI = ({ active }) => (
  <svg viewBox="0 0 24 24" fill="none" strokeWidth={active ? 2.2 : 1.6} strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2L2 7l10 5 10-5-10-5z" stroke="currentColor" />
    <path d="M2 17l10 5 10-5" stroke="currentColor" />
    <path d="M2 12l10 5 10-5" stroke="currentColor" />
  </svg>
)

const IconSettings = ({ active }) => (
  <svg viewBox="0 0 24 24" fill="none" strokeWidth={active ? 2.2 : 1.6} strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3" stroke="currentColor" />
    <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" stroke="currentColor" />
  </svg>
)

const IconPlus = () => (
  <svg viewBox="0 0 24 24" fill="none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19" stroke="currentColor" />
    <line x1="5" y1="12" x2="19" y2="12" stroke="currentColor" />
  </svg>
)

/* ── CONFIGURAÇÃO DOS ITENS DE NAVEGAÇÃO ──
   Ordem visual: [Home] [Reports] [+] [Wishlist] [Settings]
   Sem texto — apenas ícones para design mais limpo no mobile
── */

const NAV_ITEMS_LEFT = [
  { id: 'home', icon: IconHome, path: '/dashboard' },
  { id: 'reports', icon: IconReports, path: '/reports' },
]

const NAV_ITEMS_RIGHT = [
  { id: 'wishlist', icon: IconWishlist, path: '/wishlist' },
  { id: 'settings', icon: IconSettings, path: '/settings' },
]

/* ── MAPA DE ROTAS PARA DETECÇÃO AUTOMÁTICA ──
   Cada rota é mapeada para o ID do item ativo correspondente
   Isso garante que a navbar funcione em QUALQUER página do app
── */
const ROUTE_MAP = {
  '/dashboard': 'home',
  '/reports': 'reports',
  '/transactions': 'reports',      // Transações agrupadas com Relatórios
  '/wishlist': 'wishlist',
  '/wishlist-item': 'wishlist',     // Detalhe do item mantém wishlist ativo
  '/newitem': 'wishlist',           // Novo item mantém wishlist ativo
  '/chatbot': 'chat',               // ChatBot/IA
  '/settings': 'settings',
}

export default function BottomNav() {
  const navigate = useNavigate()
  const location = useLocation()

  /* ── DETECÇÃO INTELIGENTE DA ROTA ATIVA ──
     Verifica a rota atual e retorna o ID do item correspondente
     Se não encontrar match exato, faz busca parcial (ex: /wishlist-item/123 → wishlist)
  ── */
  const getActiveItem = () => {
    const path = location.pathname

    // Match exato primeiro
    if (ROUTE_MAP[path]) return ROUTE_MAP[path]

    // Match parcial (para rotas com parâmetros como /wishlist-item/1)
    for (const [route, itemId] of Object.entries(ROUTE_MAP)) {
      if (path.startsWith(route)) return itemId
    }

    return 'home' // fallback padrão
  }

  const activeItem = getActiveItem()

  return (
    <nav className="bn-root">
      <div className="bn-shell">
        {/* ── Itens da ESQUERDA ── */}
        {NAV_ITEMS_LEFT.map((item) => {
          const isActive = activeItem === item.id
          const Icon = item.icon
          return (
            <button
              key={item.id}
              className={`bn-item${isActive ? ' bn-item--active' : ''}`}
              onClick={() => navigate(item.path)}
              aria-label={item.id}
            >
              <Icon active={isActive} />
            </button>
          )
        })}

        {/* ── Espaço para o botão flutuante ── */}
        <div className="bn-spacer" />

        {/* ── Itens da DIREITA ── */}
        {NAV_ITEMS_RIGHT.map((item) => {
          const isActive = activeItem === item.id
          const Icon = item.icon
          return (
            <button
              key={item.id}
              className={`bn-item${isActive ? ' bn-item--active' : ''}`}
              onClick={() => navigate(item.path)}
              aria-label={item.id}
            >
              <Icon active={isActive} />
            </button>
          )
        })}

        {/* ── BOTÃO FLUTUANTE CENTRAL ── */}
        <button
          className="bn-add"
          onClick={() => navigate('/newexpense')}
          aria-label="adicionar despesa"
        >
          <IconPlus />
        </button>
      </div>
    </nav>
  )
}
