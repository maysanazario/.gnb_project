import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import './wishlistitem.css'
import {
  getWishlistItem,
  deleteWishlistItem,
  updateWishlistItemStatus,
  patchWishlistItem,
} from '../../services/wishlistService'
import { formatCurrency } from '../../data/mockData'
import { WISHLIST_PRIORITY_COLORS, WISHLIST_PRIORITY_FULL_LABELS, WISHLIST_PRIORITY_OPTIONS } from '../../constants/wishlistPriority'

const STATUS_OPTIONS = ['Quero', 'Guardado para depois', 'Comprado']

const CATEGORIES = [
  'Eletrônicos', 'Moda', 'Casa', 'Beleza',
  'Alimentos', 'Esportes', 'Livros', 'Jogos', 'Viagem', 'Outros',
]

const PRIORITY_CONFIG = {
  1: { label: WISHLIST_PRIORITY_FULL_LABELS[1], color: WISHLIST_PRIORITY_COLORS[1], bg: 'rgba(16,185,129,0.18)',  border: 'rgba(16,185,129,0.25)'  },
  2: { label: WISHLIST_PRIORITY_FULL_LABELS[2], color: WISHLIST_PRIORITY_COLORS[2], bg: 'rgba(245,158,11,0.18)', border: 'rgba(245,158,11,0.25)'  },
  3: { label: WISHLIST_PRIORITY_FULL_LABELS[3], color: WISHLIST_PRIORITY_COLORS[3], bg: 'rgba(239,68,68,0.18)',  border: 'rgba(239,68,68,0.25)'   },
  4: { label: WISHLIST_PRIORITY_FULL_LABELS[4], color: WISHLIST_PRIORITY_COLORS[4], bg: 'rgba(168,85,247,0.18)', border: 'rgba(168,85,247,0.25)' },
}

const CategoryIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8" aria-hidden="true">
    <rect x="5" y="2" width="14" height="20" rx="3" stroke="currentColor" />
    <circle cx="12" cy="17" r="1.2" fill="currentColor" />
  </svg>
)

export default function WishlistItem() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [item, setItem]               = useState(null)
  const [loading, setLoading]         = useState(true)
  const [error, setError]             = useState(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  // ── modo edição — SCRUM-81 ──
  const [editMode, setEditMode]       = useState(false)
  const [editData, setEditData]       = useState({})
  const [isSavingEdit, setIsSavingEdit] = useState(false)
  const [editError, setEditError]     = useState('')

  // ── atualização de status — SCRUM-82 ──
  // selectedStatus: seleção local do usuário (ainda não salva)
  const [selectedStatus, setSelectedStatus] = useState(null)
  const [savingStatus, setSavingStatus]     = useState(false)

  useEffect(() => {
    const loadItem = async () => {
      setLoading(true)
      setError(null)
      try {
        const fetched = await getWishlistItem(id)
        setItem(fetched)
        setSelectedStatus(fetched.status) // inicializa com o status atual
      } catch (err) {
        setError(err.message || 'Não foi possível carregar o item')
      } finally {
        setLoading(false)
      }
    }
    loadItem()
  }, [id])

  // Abre o formulário de edição com os valores atuais do item
  const openEdit = () => {
    setEditData({
      name:     item.name,
      price:    item.price,
      category: item.category,
      priority: item.priority,
      link:     item.link  || '',
      notes:    item.notes || '',
    })
    setEditError('')
    setEditMode(true)
  }

  const handleEditChange = (field, value) =>
    setEditData((prev) => ({ ...prev, [field]: value }))

  const handleEditPriceChange = (e) => {
    const raw = e.target.value.replace(/\D/g, '')
    if (!raw) { handleEditChange('price', ''); return }
    handleEditChange('price', parseFloat((parseInt(raw) / 100).toFixed(2)))
  }

  const displayEditPrice = () => {
    if (!editData.price && editData.price !== 0) return ''
    return String(editData.price).replace('.', ',')
  }

  // SCRUM-81: salva edição via PATCH /wishlist/:id
  const handleSaveEdit = async () => {
    setEditError('')
    if (!editData.name?.trim())   return setEditError('O nome é obrigatório')
    if (!editData.price || editData.price <= 0) return setEditError('Informe um preço válido')
    if (!editData.category)       return setEditError('Selecione uma categoria')
    if (!editData.priority)       return setEditError('Selecione a prioridade')

    setIsSavingEdit(true)
    try {
      const updated = await patchWishlistItem(id, {
        name:     editData.name.trim(),
        price:    parseFloat(editData.price),
        category: editData.category,
        priority: Number(editData.priority),
        link:     editData.link.trim(),
        notes:    editData.notes.trim(),
      })
      setItem(updated)
      setEditMode(false)
    } catch (err) {
      setEditError(err.message || 'Erro ao salvar. Tente novamente.')
    } finally {
      setIsSavingEdit(false)
    }
  }

  // SCRUM-82: salva o status selecionado e volta para a lista
  const handleConfirmStatus = async () => {
    if (!selectedStatus || selectedStatus === item.status) {
      navigate('/wishlist')
      return
    }
    setSavingStatus(true)
    try {
      await updateWishlistItemStatus(id, selectedStatus)
      navigate('/wishlist')
    } catch (err) {
      alert(err.message || 'Erro ao atualizar status.')
      setSavingStatus(false)
    }
  }

  // SCRUM-83: exclui via DELETE /wishlist/:id
  const handleDelete = async () => {
    try {
      await deleteWishlistItem(item?._id || item?.id)
      setShowDeleteModal(false)
      navigate('/wishlist')
    } catch (err) {
      alert(err.status === 403
        ? 'Você não tem permissão para excluir este item.'
        : 'Não foi possível excluir. Tente novamente.')
    }
  }

  if (loading) return <div className="wi-loading">Carregando item...</div>
  if (error)   return <div className="wi-error">Erro: {error}</div>
  if (!item)   return <div className="wi-error">Item não encontrado.</div>

  const pri = PRIORITY_CONFIG[item.priority]

  // ══════════════════════════════════════════════════
  // MODO EDIÇÃO
  // ══════════════════════════════════════════════════
  if (editMode) {
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
            <button className="wi-header__icon-btn" type="button"
              onClick={() => setEditMode(false)} aria-label="Cancelar edição">
              <svg viewBox="0 0 24 24" fill="none" strokeWidth="2.5" aria-hidden="true">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            <h1 className="wi-header__title">Editar Item</h1>
            <div style={{ width: 36 }} />
          </header>

          <div className="wi-edit-form">
            {/* Nome */}
            <div className="wi-edit-group">
              <label className="wi-edit-label" htmlFor="edit-name">Nome do item</label>
              <input id="edit-name" className="wi-edit-input" type="text"
                value={editData.name}
                onChange={(e) => handleEditChange('name', e.target.value)} />
            </div>

            {/* Preço */}
            <div className="wi-edit-group">
              <label className="wi-edit-label" htmlFor="edit-price">Preço</label>
              <div className="wi-edit-price-wrap">
                <span className="wi-edit-price-prefix">R$</span>
                <input id="edit-price" className="wi-edit-price-input"
                  type="text" inputMode="numeric"
                  value={displayEditPrice()}
                  onChange={handleEditPriceChange} />
              </div>
            </div>

            {/* Categoria */}
            <div className="wi-edit-group">
              <label className="wi-edit-label">Categoria</label>
              <div className="wi-edit-chips">
                {CATEGORIES.map((cat) => (
                  <button key={cat} type="button"
                    className={`wi-edit-chip${editData.category === cat ? ' wi-edit-chip--active' : ''}`}
                    onClick={() => handleEditChange('category', cat)}>
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Prioridade */}
            <div className="wi-edit-group">
              <label className="wi-edit-label">Prioridade</label>
              <div className="wi-edit-priority-row">
                {WISHLIST_PRIORITY_OPTIONS.map((p) => {
                  const isActive = Number(editData.priority) === p.value
                  return (
                    <button key={p.value} type="button"
                      className={`wi-edit-priority-card${isActive ? ' wi-edit-priority-card--active' : ''}`}
                      style={isActive ? { '--p-color': p.color, '--p-bg': `${p.color}18` } : {}}
                      onClick={() => handleEditChange('priority', p.value)}>
                      <span className="wi-edit-priority-dot" style={{ background: p.color }} />
                      <span className="wi-edit-priority-label">{p.label}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Link */}
            <div className="wi-edit-group">
              <label className="wi-edit-label" htmlFor="edit-link">Link (opcional)</label>
              <input id="edit-link" className="wi-edit-input" type="url"
                placeholder="https://..." value={editData.link}
                onChange={(e) => handleEditChange('link', e.target.value)} />
            </div>

            {/* Notas */}
            <div className="wi-edit-group">
              <label className="wi-edit-label" htmlFor="edit-notes">Notas</label>
              <textarea id="edit-notes" className="wi-edit-textarea" rows={3}
                placeholder="Observações sobre o item..."
                value={editData.notes}
                onChange={(e) => handleEditChange('notes', e.target.value)} />
            </div>

            {editError && <p className="wi-edit-error">⚠️ {editError}</p>}

            <button className="wi-edit-save" type="button"
              onClick={handleSaveEdit} disabled={isSavingEdit}>
              <svg viewBox="0 0 24 24" fill="none" strokeWidth="2.5" aria-hidden="true">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              {isSavingEdit ? 'Salvando...' : 'Salvar alterações'}
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ══════════════════════════════════════════════════
  // MODO VISUALIZAÇÃO
  // ══════════════════════════════════════════════════
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
          <button className="wi-header__icon-btn" type="button"
            onClick={() => navigate('/wishlist')} aria-label="Voltar">
            <svg viewBox="0 0 24 24" fill="none" strokeWidth="2.5" aria-hidden="true">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <h1 className="wi-header__title">{item.name}</h1>
          <div className="wi-header__actions">
            {/* SCRUM-81: botão editar */}
            <button className="wi-header__icon-btn" type="button"
              onClick={openEdit} aria-label="Editar item">
              <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" aria-hidden="true">
                <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
            </button>
            {/* SCRUM-83: botão excluir */}
            <button className="wi-header__icon-btn wi-header__icon-btn--delete" type="button"
              onClick={() => setShowDeleteModal(true)} aria-label="Excluir item">
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
          {/* hero */}
          <div className="wi-card wi-hero">
            <div className="wi-hero__icon"><CategoryIcon /></div>
            <h2 className="wi-hero__name">{item.name}</h2>
            <div className="wi-hero__tags">
              <span className="wi-tag wi-tag--cat">{item.category}</span>
              <span className="wi-tag wi-tag--pri"
                style={{ color: pri.color, background: pri.bg, borderColor: pri.border }}>
                {pri.label}
              </span>
            </div>
          </div>

          {/* preço */}
          <div className="wi-card wi-price-card">
            <span className="wi-card__label">Preço</span>
            <span className="wi-price">{formatCurrency(item.price)}</span>
          </div>

          {/* SCRUM-82: seletor de status com 3 opções — seleção local, sem salvar ainda */}
          <div className="wi-card wi-status-card">
            <span className="wi-card__label">Status</span>
            <div className="wi-status-options">
              {STATUS_OPTIONS.map((s) => (
                <button
                  key={s}
                  type="button"
                  className={`wi-status-option${selectedStatus === s ? ' wi-status-option--active' : ''} wi-status-option--${s === 'Comprado' ? 'done' : s === 'Guardado para depois' ? 'saved' : 'want'}`}
                  onClick={() => setSelectedStatus(s)}
                  disabled={savingStatus}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* link */}
          {item.link && (
            <div className="wi-card wi-link-card">
              <span className="wi-card__label">Link</span>
              <div className="wi-link-row">
                <span className="wi-link-text">{item.link}</span>
                <a href={`https://${item.link}`} target="_blank" rel="noopener noreferrer"
                  className="wi-link-btn" aria-label="Abrir link externo">
                  <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" aria-hidden="true">
                    <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
                    <polyline points="15 3 21 3 21 9" />
                    <line x1="10" y1="14" x2="21" y2="3" />
                  </svg>
                </a>
              </div>
            </div>
          )}

          {/* notas */}
          {item.notes && (
            <div className="wi-card wi-notes-card">
              <span className="wi-card__label">Notas</span>
              <p className="wi-notes-text">{item.notes}</p>
            </div>
          )}
        </div>

        {/* botão confirmar — salva o status selecionado e volta para a lista */}
        <div className="wi-footer">
          <button
            className="wi-cta"
            type="button"
            onClick={handleConfirmStatus}
            disabled={savingStatus}
          >
            <svg viewBox="0 0 24 24" fill="none" strokeWidth="2.5" aria-hidden="true">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            {savingStatus ? 'Salvando...' : 'Confirmar'}
          </button>
        </div>
      </div>

      {/* modal exclusão */}
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
              <button className="wi-modal__btn wi-modal__btn--cancel"
                onClick={() => setShowDeleteModal(false)}>Cancelar</button>
              <button className="wi-modal__btn wi-modal__btn--delete"
                onClick={handleDelete}>Sim, excluir</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
