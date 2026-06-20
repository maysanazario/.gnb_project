import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import './wishlist.css'
import BottomNav from '../../components/BottomNav'
import { formatCurrency } from '../../data/mockData'
import { getWishlistItems } from '../../services/wishlistService'
import { WISHLIST_PRIORITY_LABELS, WISHLIST_PRIORITY_COLORS } from '../../constants/wishlistPriority'

const CATEGORIES = [
  'Eletrônicos', 'Moda', 'Casa', 'Beleza',
  'Alimentos', 'Esportes', 'Livros', 'Jogos', 'Viagem', 'Outros',
]

const STATUS_OPTIONS = ['Quero', 'Guardado para depois', 'Comprado']

const PRIORITY_FILTERS = [
  { id: '4', label: 'Urgente' },
  { id: '3', label: 'Alta'    },
  { id: '2', label: 'Média'   },
  { id: '1', label: 'Baixa'   },
]

export default function WishList() {
  const navigate = useNavigate()

  const [priorityFilter, setPriorityFilter] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [statusFilter,   setStatusFilter]   = useState('')
  const [filterOpen,     setFilterOpen]     = useState(false)

  const [items,   setItems]   = useState([])
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState(null)

  const loadItems = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const filters = {}
      if (priorityFilter) filters.priority = priorityFilter
      if (categoryFilter) filters.category = categoryFilter
      if (statusFilter)   filters.status   = statusFilter
      const data = await getWishlistItems(filters)
      setItems(data || [])
    } catch (err) {
      setError(err.message || 'Não foi possível carregar a wishlist')
    } finally {
      setLoading(false)
    }
  }, [priorityFilter, categoryFilter, statusFilter])

  useEffect(() => { loadItems() }, [loadItems])

  const clearFilters = () => {
    setPriorityFilter('')
    setCategoryFilter('')
    setStatusFilter('')
  }

  // Conta quantos filtros estão ativos para o badge
  const activeFilterCount = [priorityFilter, categoryFilter, statusFilter].filter(Boolean).length
  const totalValue = items.reduce((sum, i) => sum + (Number(i.price) || 0), 0)

  return (
    <div className="wl-root">
      <div className="wl-deco" aria-hidden="true">
        <div className="wl-deco__dot wl-deco__dot--tr" />
        <div className="wl-deco__diamond wl-deco__diamond--tr" />
        <div className="wl-deco__diamond wl-deco__diamond--tr2" />
        <div className="wl-deco__dot wl-deco__dot--tl" />
      </div>

      <div className="wl-shell">

        {/* ── header ── */}
        <header className="wl-header">
          <button className="wl-header__back" onClick={() => navigate('/dashboard')} aria-label="Voltar">
            <svg viewBox="0 0 24 24" fill="none" strokeWidth="2.5" aria-hidden="true">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>

          <div className="wl-header__text">
            <span className="wl-header__greeting">Olá, Juninho 🔥</span>
            <h1 className="wl-header__title">Lista de Desejos</h1>
          </div>

          {/* botão de filtro com badge */}
          <button
            className={`wl-filter-btn${filterOpen ? ' wl-filter-btn--open' : ''}${activeFilterCount > 0 ? ' wl-filter-btn--active' : ''}`}
            onClick={() => setFilterOpen((v) => !v)}
            aria-label="Filtros"
            aria-expanded={filterOpen}
          >
            <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" stroke="currentColor" />
            </svg>
            {activeFilterCount > 0 && (
              <span className="wl-filter-btn__badge">{activeFilterCount}</span>
            )}
          </button>
        </header>

        {/* ── painel de filtros colapsável ── */}
        <div className={`wl-filter-panel${filterOpen ? ' wl-filter-panel--open' : ''}`}>
          <div className="wl-filter-panel__inner">

            {/* prioridade */}
            <div className="wl-filter-group">
              <span className="wl-filter-label">Prioridade</span>
              <div className="wl-filters">
                <button
                  className={`wl-filters__pill${!priorityFilter ? ' wl-filters__pill--active' : ''}`}
                  onClick={() => setPriorityFilter('')}
                >
                  Todas
                </button>
                {PRIORITY_FILTERS.map((f) => (
                  <button key={f.id}
                    className={`wl-filters__pill${priorityFilter === f.id ? ' wl-filters__pill--active' : ''}`}
                    onClick={() => setPriorityFilter(priorityFilter === f.id ? '' : f.id)}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* status */}
            <div className="wl-filter-group">
              <span className="wl-filter-label">Status</span>
              <div className="wl-filters">
                <button
                  className={`wl-filters__pill${!statusFilter ? ' wl-filters__pill--active' : ''}`}
                  onClick={() => setStatusFilter('')}
                >
                  Todos
                </button>
                {STATUS_OPTIONS.map((s) => (
                  <button key={s}
                    className={`wl-filters__pill${statusFilter === s ? ' wl-filters__pill--active' : ''}`}
                    onClick={() => setStatusFilter(statusFilter === s ? '' : s)}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* categoria */}
            <div className="wl-filter-group">
              <span className="wl-filter-label">Categoria</span>
              <div className="wl-filters">
                <button
                  className={`wl-filters__pill${!categoryFilter ? ' wl-filters__pill--active' : ''}`}
                  onClick={() => setCategoryFilter('')}
                >
                  Todas
                </button>
                {CATEGORIES.map((c) => (
                  <button key={c}
                    className={`wl-filters__pill${categoryFilter === c ? ' wl-filters__pill--active' : ''}`}
                    onClick={() => setCategoryFilter(categoryFilter === c ? '' : c)}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {/* ação limpar */}
            {activeFilterCount > 0 && (
              <button className="wl-clear-filters" onClick={clearFilters}>
                Limpar {activeFilterCount} filtro{activeFilterCount > 1 ? 's' : ''}
              </button>
            )}

          </div>
        </div>

        {/* ── resumo ── */}
        <p className="wl-summary">
          <span className="wl-summary__count">{items.length} itens</span>
          <span className="wl-summary__sep">·</span>
          <span className="wl-summary__value">{formatCurrency(totalValue)}</span>
          <span className="wl-summary__label"> no total</span>
          {activeFilterCount > 0 && (
            <span className="wl-summary__filtered"> · {activeFilterCount} filtro{activeFilterCount > 1 ? 's' : ''} ativo{activeFilterCount > 1 ? 's' : ''}</span>
          )}
        </p>

        {loading && <div className="wl-status">Carregando itens...</div>}
        {error   && <div className="wl-error">Erro: {error}</div>}

        {!loading && !error && items.length === 0 && (
          <div className="wl-empty">
            <p>{activeFilterCount > 0 ? 'Nenhum item encontrado com esses filtros.' : 'Sua wishlist está vazia.'}</p>
            {activeFilterCount > 0 && (
              <button className="wl-clear-filters" onClick={clearFilters}>Limpar filtros</button>
            )}
          </div>
        )}

        {!loading && !error && items.length > 0 && (
          <ul className="wl-list" role="list">
            {items.map((item) => {
              const itemId   = item._id || item.id
              const isBought = item.status === 'Comprado'
              const isSaved  = item.status === 'Guardado para depois'
              return (
                <li key={itemId}>
                  <button
                    className="wl-card"
                    onClick={() => navigate(`/wishlist-item/${itemId}`)}
                    aria-label={`Ver detalhes de ${item.name}`}
                  >
                    <div className="wl-card__top">
                      <div className="wl-card__name-row">
                        <span className="wl-card__dot"
                          style={{ background: WISHLIST_PRIORITY_COLORS[item.priority] }} />
                        <span className="wl-card__name">{item.name}</span>
                      </div>
                      <span className="wl-card__dots" aria-hidden="true">···</span>
                    </div>

                    <div className="wl-card__bottom">
                      <div className="wl-card__tags">
                        <span className="wl-tag wl-tag--cat">{item.category}</span>
                        <span className={`wl-tag wl-tag--pri wl-tag--pri-${item.priority}`}>
                          {WISHLIST_PRIORITY_LABELS[item.priority]}
                        </span>
                        <span className={`wl-tag wl-tag--status${isBought ? ' wl-tag--status-done' : isSaved ? ' wl-tag--status-saved' : ''}`}>
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
                      <div className="wl-card__price-purchased">{formatCurrency(item.price)}</div>
                    )}
                  </button>
                </li>
              )
            })}
          </ul>
        )}

        <div className="wl-spacer" />
      </div>

      <BottomNav />
    </div>
  )
}
