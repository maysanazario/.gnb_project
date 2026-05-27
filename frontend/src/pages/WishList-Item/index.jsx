import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import './wishlistitem.css'

const MOCK_ITEMS = [
  {
    id: 1,
    name: 'iPhone 15 Pro',
    category: 'Eletrônico',
    priority: 'alta',
    price: 7999.00,
    purchased: false,
    link: 'apple.com/br/shop/iphone-15-pro',
    notes: 'Versão Titânio Natural, 256GB. Comprar na loja oficial para garantia brasileira.',
  },
  {
    id: 2,
    name: 'Cafeteira Nespresso',
    category: 'Casa',
    priority: 'alta',
    price: 599.00,
    purchased: false,
    link: '',
    notes: '',
  },
  {
    id: 3,
    name: 'Tênis Nike Air Max',
    category: 'Moda',
    priority: 'media',
    price: 899.00,
    purchased: false,
    link: '',
    notes: '',
  },
  {
    id: 4,
    name: 'Livro: Pai Rico Pai Pobre',
    category: 'Livros',
    priority: 'baixa',
    price: 49.90,
    purchased: true,
    link: '',
    notes: '',
  },
]

const PRIORITY_CONFIG = {
  alta:  { label: 'Alta prioridade',  color: '#ef4444', bg: 'rgba(239,68,68,0.18)',  border: 'rgba(239,68,68,0.25)'  },
  media: { label: 'Média prioridade', color: '#f59e0b', bg: 'rgba(245,158,11,0.18)', border: 'rgba(245,158,11,0.25)' },
  baixa: { label: 'Baixa prioridade', color: '#10b981', bg: 'rgba(16,185,129,0.18)', border: 'rgba(16,185,129,0.25)' },
}

export default function WishlistItem() {
  const { id } = useParams()
  const navigate = useNavigate()

  const item = MOCK_ITEMS.find((i) => i.id === Number(id)) ?? MOCK_ITEMS[0]
  const [purchased, setPurchased] = useState(item.purchased)
  
  // Estado para o modal de confirmação de exclusão
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  const pri = PRIORITY_CONFIG[item.priority]

  const formatCurrency = (v) =>
    new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
    }).format(v)

  const categoryIcon = (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8" aria-hidden="true">
      <rect x="5" y="2" width="14" height="20" rx="3" stroke="currentColor" />
      <circle cx="12" cy="17" r="1.2" fill="currentColor" />
    </svg>
  )

  // Função para excluir o item
  const handleDelete = () => {
    // TODO: conectar com a API para remover o item
    console.log('Item excluído:', item.id, item.name)
    setShowDeleteModal(false)
    // Redireciona para a lista de desejos após excluir
    navigate('/wishlist')
  }

  return (
    <div className="wi-root">
      {/* ── decorações ── */}
      <div className="wi-deco" aria-hidden="true">
        <div className="wi-deco__dot wi-deco__dot--tl" />
        <div className="wi-deco__dot wi-deco__dot--tr" />
        <div className="wi-deco__diamond wi-deco__diamond--tr" />
        <div className="wi-deco__diamond wi-deco__diamond--tr2" />
      </div>

      <div className="wi-shell">
        {/* ── header ── */}
        <header className="wi-header">
          <button
            className="wi-header__icon-btn"
            type="button"
            onClick={() => navigate('/wishlist')}
            aria-label="Voltar"
          >
            <svg viewBox="0 0 24 24" fill="none" strokeWidth="2.5" aria-hidden="true">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>

          <h1 className="wi-header__title">{item.name}</h1>

          <div className="wi-header__actions">
            <button
              className="wi-header__icon-btn"
              type="button"
              onClick={() => navigate(`/wishlist-edit/${item.id}`)}
              aria-label="Editar"
            >
              <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" aria-hidden="true">
                <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
            </button>
            
            {/* Botão de excluir - ícone de lixeira */}
            <button
              className="wi-header__icon-btn wi-header__icon-btn--delete"
              type="button"
              onClick={() => setShowDeleteModal(true)}
              aria-label="Excluir item"
            >
              <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" aria-hidden="true">
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6" />
                <line x1="10" y1="11" x2="10" y2="17" />
                <line x1="14" y1="11" x2="14" y2="17" />
              </svg>
            </button>
          </div>
        </header>

        <div className="wi-body">
          {/* ── hero card ── */}
          <div className="wi-card wi-hero">
            <div className="wi-hero__icon">
              {categoryIcon}
            </div>
            <h2 className="wi-hero__name">{item.name}</h2>
            <div className="wi-hero__tags">
              <span className="wi-tag wi-tag--cat">{item.category}</span>
              <span
                className="wi-tag wi-tag--pri"
                style={{ color: pri.color, background: pri.bg, borderColor: pri.border }}
              >
                {pri.label}
              </span>
            </div>
          </div>

          {/* ── preço ── */}
          <div className="wi-card wi-price-card">
            <span className="wi-card__label">Preço</span>
            <span className="wi-price">{formatCurrency(item.price)}</span>
          </div>

          {/* ── status ── */}
          <div className="wi-card wi-status-card">
            <div className="wi-status-left">
              <span className="wi-card__label">Status</span>
              <span className={`wi-status-text${purchased ? ' wi-status-text--done' : ''}`}>
                {purchased ? 'Comprado' : 'Pendente'}
              </span>
            </div>
            <button
              className={`wi-toggle${purchased ? ' wi-toggle--on' : ''}`}
              type="button"
              role="switch"
              aria-checked={purchased}
              aria-label="Marcar como comprado"
              onClick={() => setPurchased((v) => !v)}
            >
              <span className="wi-toggle__thumb" />
            </button>
          </div>

          {/* ── link ── */}
          {item.link && (
            <div className="wi-card wi-link-card">
              <span className="wi-card__label">Link</span>
              <div className="wi-link-row">
                <span className="wi-link-text">{item.link}</span>
                <a
                  href={`https://${item.link}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="wi-link-btn"
                  aria-label="Abrir link externo"
                >
                  <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" aria-hidden="true">
                    <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
                    <polyline points="15 3 21 3 21 9" />
                    <line x1="10" y1="14" x2="21" y2="3" />
                  </svg>
                </a>
              </div>
            </div>
          )}

          {/* ── notas ── */}
          {item.notes && (
            <div className="wi-card wi-notes-card">
              <span className="wi-card__label">Notas</span>
              <p className="wi-notes-text">{item.notes}</p>
            </div>
          )}
        </div>

        {/* ── botão principal ── */}
        <div className="wi-footer">
          <button
            className={`wi-cta${purchased ? ' wi-cta--done' : ''}`}
            type="button"
            onClick={() => setPurchased((v) => !v)}
          >
            <svg viewBox="0 0 24 24" fill="none" strokeWidth="2.5" aria-hidden="true">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            {purchased ? 'Marcar como pendente' : 'Marcar como comprado'}
          </button>
        </div>
      </div>

      {/* ── MODAL DE CONFIRMAÇÃO DE EXCLUSÃO ── */}
      {showDeleteModal && (
        <div className="wi-modal-overlay" onClick={() => setShowDeleteModal(false)}>
          <div className="wi-modal" onClick={(e) => e.stopPropagation()}>
            <div className="wi-modal__icon">
              <svg viewBox="0 0 24 24" fill="none" strokeWidth="2">
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6" />
                <line x1="10" y1="11" x2="10" y2="17" />
                <line x1="14" y1="11" x2="14" y2="17" />
              </svg>
            </div>
            <h3 className="wi-modal__title">Excluir item?</h3>
            <p className="wi-modal__message">
              Tem certeza que deseja excluir <strong>“{item.name}”</strong>?<br />
              Esta ação não pode ser desfeita.
            </p>
            <div className="wi-modal__actions">
              <button
                className="wi-modal__btn wi-modal__btn--cancel"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancelar
              </button>
              <button
                className="wi-modal__btn wi-modal__btn--delete"
                onClick={handleDelete}
              >
                Sim, excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}