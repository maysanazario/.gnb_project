import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './wishlist.css'

export default function WishlistOne() {
  const navigate = useNavigate()
  const [activeFilter, setActiveFilter] = useState('todos')

  const [items] = useState([
    {
      id: 1,
      name: 'iPhone 15 Pro',
      category: 'Eletrônico',
      priority: 'alta',
      price: 7999.00,
      purchased: false,
    },
    {
      id: 2,
      name: 'Cafeteira Nespresso',
      category: 'Casa',
      priority: 'alta',
      price: 599.00,
      purchased: false,
    },
    {
      id: 3,
      name: 'Tênis Nike Air Max',
      category: 'Moda',
      priority: 'media',
      price: 899.00,
      purchased: false,
    },
    {
      id: 4,
      name: 'Livro: Pai Rico Pai Pobre',
      category: 'Livros',
      priority: 'baixa',
      price: 49.90,
      purchased: true,
    },
  ])

  const filters = [
    { id: 'todos', label: 'Todos' },
    { id: 'alta',  label: 'Alta'  },
    { id: 'media', label: 'Média' },
    { id: 'baixa', label: 'Baixa' },
  ]

  const priorityDotColor = {
    alta:  '#ef4444',
    media: '#f59e0b',
    baixa: '#10b981',
  }

  const priorityLabel = {
    alta:  'Alta',
    media: 'Média',
    baixa: 'Baixa',
  }

  const filteredItems = items.filter(
    (item) => activeFilter === 'todos' || item.priority === activeFilter
  )

  const totalValue = items.reduce((sum, i) => sum + i.price, 0)

  const formatCurrency = (v) =>
    new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
    }).format(v)

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

        {/* ── lista ── */}
        <ul className="wl-list" role="list">
          {filteredItems.map((item) => (
            <li key={item.id}>
              <button
                className="wl-card"
                onClick={() => navigate(`/wishlist-item`)}
                aria-label={`Ver detalhes de ${item.name}`}
              >
                {/* linha do nome */}
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

                {/* linha das tags + preço/badge */}
                <div className="wl-card__bottom">
                  <div className="wl-card__tags">
                    <span className="wl-tag wl-tag--cat">{item.category}</span>
                    <span className={`wl-tag wl-tag--pri wl-tag--${item.priority}`}>
                      {priorityLabel[item.priority]}
                    </span>
                  </div>

                  {item.purchased ? (
                    <span className="wl-card__bought">
                      <svg viewBox="0 0 24 24" fill="none" strokeWidth="2.5" aria-hidden="true">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      Comprado!
                    </span>
                  ) : (
                    <span className="wl-card__price">{formatCurrency(item.price)}</span>
                  )}
                </div>

                {/* preço do item comprado fica abaixo do badge */}
                {item.purchased && (
                  <div className="wl-card__price-purchased">
                    {formatCurrency(item.price)}
                  </div>
                )}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}