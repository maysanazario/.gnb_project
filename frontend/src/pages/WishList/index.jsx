import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import './wishlist.css'
import BottomNav from '../BottomNav'
import { formatCurrency } from '../../data/mockData'
import { getWishlistItems } from '../../services/wishlistService'
import {
  WISHLIST_PRIORITY_LABELS,
  WISHLIST_PRIORITY_COLORS,
} from '../../constants/wishlistPriority'

export default function WishlistOne() {
  const navigate = useNavigate()
  const [activeFilter, setActiveFilter] = useState('todos')
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadItems = async () => {
      setLoading(true)
      setError(null)
      try {
        const fetchedItems = await getWishlistItems()
        setItems(fetchedItems)
      } catch (fetchError) {
        console.error(fetchError)
        setError(fetchError.message || 'Não foi possível carregar a wishlist')
      } finally {
        setLoading(false)
      }
    }

    loadItems()
  }, [])

  const filters = [
    { id: 'todos', label: 'Todos' },
    { id: '1', label: 'Baixa' },
    { id: '2', label: 'Média' },
    { id: '3', label: 'Alta' },
    { id: '4', label: 'Urgente' },
  ]

  const priorityDotColor = WISHLIST_PRIORITY_COLORS
  const priorityLabel = WISHLIST_PRIORITY_LABELS

  const filteredItems = items
    .filter((item) => activeFilter === 'todos' || String(item.priority) === activeFilter)
    .sort((a, b) => {
      const priorityDiff = Number(b.priority) - Number(a.priority)
      if (priorityDiff !== 0) return priorityDiff

      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0
      return dateB - dateA
    })

  const totalValue = items.reduce((sum, i) => sum + (Number(i.price) || 0), 0)

  return (
    <div className="wl-root">
      {/* ── decorações geométricas ── */}
      <div className="wl-deco" aria-hidden="true">
        <div className="wl-deco__dot wl-deco__dot--tr" />
        <div className="wl-deco__diamond wl-deco__diamond--tr" />
        <div className="wl-deco__diamond wl-deco__diamond--tr2" />
        <div className="wl-deco__dot wl-deco__dot--tl" />
      </div>

      <div className="wl-shell">
        {/* ── header ── */}
        <header className="wl-header">
          <button
            className="wl-header__back"
            onClick={() => navigate('/dashboard')}
            aria-label="Voltar"
          >
            <svg viewBox="0 0 24 24" fill="none" strokeWidth="2.5" aria-hidden="true">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>

          <div className="wl-header__text">
            <span className="wl-header__greeting">Olá, Juninho 🔥</span>
            <h1 className="wl-header__title">Lista de Desejos</h1>
          </div>

          <button
            className="wl-header__add"
            onClick={() => navigate('/newitem')}
            aria-label="Adicionar desejo"
          >
            <svg viewBox="0 0 24 24" fill="none" strokeWidth="2.5" aria-hidden="true">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5"  y1="12" x2="19" y2="12" />
            </svg>
          </button>
        </header>

        {/* ── filtros ── */}
        <nav className="wl-filters" aria-label="Filtrar por prioridade">
          {filters.map((f) => (
            <button
              key={f.id}
              className={`wl-filters__pill${activeFilter === f.id ? ' wl-filters__pill--active' : ''}`}
              onClick={() => setActiveFilter(f.id)}
            >
              {f.label}
            </button>
          ))}
        </nav>

        {/* ── resumo ── */}
        <p className="wl-summary">
          <span className="wl-summary__count">{items.length} itens</span>
          <span className="wl-summary__sep">·</span>
          <span className="wl-summary__value">{formatCurrency(totalValue)}</span>
          <span className="wl-summary__label"> no total</span>
        </p>

        {loading && <div className="wl-status">Carregando itens...</div>}
        {error && <div className="wl-error">Erro: {error}</div>}

        {!loading && !error && (
          <ul className="wl-list" role="list">
            {filteredItems.map((item) => {
              const itemId = item._id || item.id
              const statusClass = item.status === 'Comprado' ? ' wl-tag--status-done' : ''
              const isBought = item.status === 'Comprado'

              return (
                <li key={itemId}>
                  <button
                    className="wl-card"
                    onClick={() => navigate(`/wishlist-item/${itemId}`)}
                    aria-label={`Ver detalhes de ${item.name}`}
                  >
                    <div className="wl-card__top">
                      <div className="wl-card__name-row">
                        <span
                          className="wl-card__dot"
                          style={{ background: priorityDotColor[item.priority] }}
                        />
                        <span className="wl-card__name">{item.name}</span>
                      </div>
                      <span className="wl-card__dots" aria-hidden="true">···</span>
                    </div>

                    <div className="wl-card__bottom">
                      <div className="wl-card__tags">
                        <span className="wl-tag wl-tag--cat">{item.category}</span>
                        <span className={`wl-tag wl-tag--pri wl-tag--pri-${item.priority}`}>
                          {priorityLabel[item.priority]}
                        </span>
                        <span className={`wl-tag wl-tag--status${statusClass}`}>
                          {item.status}
                        </span>
                      </div>
                      {isBought ? (
                        <span className="wl-card__bought">
                          <svg viewBox="0 0 24 24" fill="none" strokeWidth="2.5" aria-hidden="true">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                          Comprado
                        </span>
                      ) : (
                        <span className="wl-card__price">{formatCurrency(item.price)}</span>
                      )}
                    </div>

                    {isBought && (
                      <div className="wl-card__price-purchased">
                        {formatCurrency(item.price)}
                      </div>
                    )}
                  </button>
                </li>
              )
            })}
          </ul>
        )}

        <div className="wl-spacer" />
      </div>

      {/* ── bottom navigation ── */}
      <BottomNav active="wishlist" />
    </div>
  )
}
