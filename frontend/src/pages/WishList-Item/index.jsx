import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import './wishlistitem.css'
import BottomNav from '../BottomNav'
import { getWishlistItem, deleteWishlistItem, updateWishlistItem } from '../../services/wishlistService'
import { formatCurrency } from '../../data/mockData'
import {
  WISHLIST_PRIORITY_COLORS,
  WISHLIST_PRIORITY_FULL_LABELS,
} from '../../constants/wishlistPriority'

const PRIORITY_CONFIG = {
  1: {
    label: WISHLIST_PRIORITY_FULL_LABELS[1],
    color: WISHLIST_PRIORITY_COLORS[1],
    bg: 'rgba(16,185,129,0.18)',
    border: 'rgba(16,185,129,0.25)',
  },
  2: {
    label: WISHLIST_PRIORITY_FULL_LABELS[2],
    color: WISHLIST_PRIORITY_COLORS[2],
    bg: 'rgba(245,158,11,0.18)',
    border: 'rgba(245,158,11,0.25)',
  },
  3: {
    label: WISHLIST_PRIORITY_FULL_LABELS[3],
    color: WISHLIST_PRIORITY_COLORS[3],
    bg: 'rgba(239,68,68,0.18)',
    border: 'rgba(239,68,68,0.25)',
  },
  4: {
    label: WISHLIST_PRIORITY_FULL_LABELS[4],
    color: WISHLIST_PRIORITY_COLORS[4],
    bg: 'rgba(168,85,247,0.18)',
    border: 'rgba(168,85,247,0.25)',
  },
}

export default function WishlistItem() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [item, setItem] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [savingStatus, setSavingStatus] = useState(false)

  useEffect(() => {
    const loadItem = async () => {
      setLoading(true)
      setError(null)

      try {
        const fetchedItem = await getWishlistItem(id)
        setItem(fetchedItem)
      } catch (fetchError) {
        console.error(fetchError)
        setError(fetchError.message || 'Não foi possível carregar o item')
      } finally {
        setLoading(false)
      }
    }

    loadItem()
  }, [id])

  const itemId = item?._id || item?.id
  const pri = item ? PRIORITY_CONFIG[item.priority] : null
  const isBought = item?.status === 'Comprado'

  const categoryIcon = (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8" aria-hidden="true">
      <rect x="5" y="2" width="14" height="20" rx="3" stroke="currentColor" />
      <circle cx="12" cy="17" r="1.2" fill="currentColor" />
    </svg>
  )

  const handleDelete = async () => {
    try {
      await deleteWishlistItem(itemId)
      setShowDeleteModal(false)
      navigate('/wishlist')
    } catch (deleteError) {
      console.error(deleteError)
      alert('Não foi possível excluir o item. Tente novamente.')
    }
  }

  const handleToggleStatus = async () => {
    if (!item) return

    const nextStatus = item.status === 'Quero' ? 'Comprado' : 'Quero'
    setSavingStatus(true)

    try {
      const updated = await updateWishlistItem(itemId, { status: nextStatus })
      setItem(updated)
    } catch (updateError) {
      console.error(updateError)
      alert('Não foi possível atualizar o status. Tente novamente.')
    } finally {
      setSavingStatus(false)
    }
  }

  if (loading) {
    return <div className="wi-loading">Carregando item...</div>
  }

  if (error) {
    return <div className="wi-error">Erro: {error}</div>
  }

  if (!item) {
    return <div className="wi-error">Item não encontrado.</div>
  }

  return (
    <div className="wi-root">
      <div className="wi-deco" aria-hidden="true">
        <div className="wi-deco__dot wi-deco__dot--tl" />
        <div className="wi-deco__dot wi-deco__dot--tr" />
        <div className="wi-deco__diamond wi-deco__diamond--tr" />
        <div className="wi-deco__diamond wi-deco__diamond--tr2" />
      </div>

      <div className="wi-shell">
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
          <div className="wi-card wi-hero">
            <div className="wi-hero__icon">{categoryIcon}</div>
            <h2 className="wi-hero__name">{item.name}</h2>
            <div className="wi-hero__tags">
              <span className="wi-tag wi-tag--cat">{item.category}</span>
              <span
                className="wi-tag wi-tag--pri"
                style={{ color: pri.color, background: pri.bg, borderColor: pri.border }}
              >
                {pri.label}
              </span>
              <span className={`wi-tag wi-tag--status${isBought ? ' wi-tag--status--done' : ''}`}>
                {item.status}
              </span>
            </div>
          </div>

          <div className="wi-card wi-price-card">
            <span className="wi-card__label">Preço</span>
            <span className="wi-price">{formatCurrency(item.price)}</span>
          </div>

          <div className="wi-card wi-status-card">
            <div className="wi-status-left">
              <span className="wi-card__label">Status</span>
              <span className={`wi-status-text${isBought ? ' wi-status-text--done' : ''}`}>
                {item.status}
              </span>
            </div>
            <button
              className={`wi-toggle${isBought ? ' wi-toggle--on' : ''}`}
              type="button"
              role="switch"
              aria-checked={isBought}
              aria-label="Alternar status do item"
              onClick={handleToggleStatus}
              disabled={savingStatus}
            >
              <span className="wi-toggle__thumb" />
            </button>
          </div>

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

          {item.notes && (
            <div className="wi-card wi-notes-card">
              <span className="wi-card__label">Notas</span>
              <p className="wi-notes-text">{item.notes}</p>
            </div>
          )}
        </div>

        <div className="wi-footer">
          <button
            className={`wi-cta${isBought ? ' wi-cta--done' : ''}`}
            type="button"
            onClick={handleToggleStatus}
            disabled={savingStatus}
          >
            <svg viewBox="0 0 24 24" fill="none" strokeWidth="2.5" aria-hidden="true">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            {isBought ? 'Marcar como quero' : 'Marcar como comprado'}
          </button>
        </div>
      </div>

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
              Tem certeza que deseja excluir <strong>"{item.name}"</strong>?<br />
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
