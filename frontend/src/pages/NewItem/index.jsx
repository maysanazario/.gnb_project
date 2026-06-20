import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './newitem.css'
import BottomNav from '../../components/BottomNav'
import { createWishlistItem } from '../../services/wishlistService'
import { WISHLIST_PRIORITY_OPTIONS, WISHLIST_PRIORITY_VALUES } from '../../constants/wishlistPriority'

export default function NewItem() {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    name: '', price: '', category: '', priority: '', link: '', notes: '',
  })
  const [activeCategory, setActiveCategory] = useState('')
  const [activePriority, setActivePriority] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const categories = [
    'Eletrônicos', 'Moda', 'Casa', 'Beleza',
    'Alimentos', 'Esportes', 'Livros', 'Jogos', 'Viagem', 'Outros',
  ]

  const handleChange = (field, value) =>
    setFormData((prev) => ({ ...prev, [field]: value }))

  const handlePriceChange = (e) => {
    const raw = e.target.value.replace(/\D/g, '')
    if (!raw) { handleChange('price', ''); return }
    handleChange('price', (parseInt(raw) / 100).toFixed(2))
  }

  const displayPrice = () => formData.price ? formData.price.replace('.', ',') : ''

  const handleSubmit = async (e) => {
    e.preventDefault()

    const name     = formData.name.trim()
    const priceVal = parseFloat(formData.price)
    const priority = Number(formData.priority)

    if (!name) return alert('Por favor, informe o nome do item')
    if (!formData.price || isNaN(priceVal) || priceVal <= 0)
      return alert('Por favor, informe um preço válido maior que zero')
    if (!formData.category) return alert('Por favor, selecione uma categoria')
    if (!WISHLIST_PRIORITY_VALUES.includes(priority))
      return alert('Por favor, selecione a prioridade')

    setIsSubmitting(true)
    try {
      await createWishlistItem({
        name,
        price: priceVal,
        category: formData.category,
        priority,
        status: 'Quero',
        link:  formData.link.trim(),
        notes: formData.notes.trim(),
      })
      alert('✨ Item adicionado com sucesso!')
      navigate('/wishlist')
    } catch (error) {
      console.error(error)
      alert('Não foi possível salvar o item. Tente novamente.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="ni-root">
      <div className="ni-deco" aria-hidden="true">
        <div className="ni-deco__dot" />
        <div className="ni-deco__diamond" />
        <div className="ni-deco__diamond ni-deco__diamond--sm" />
      </div>

      <div className="ni-shell">
        <header className="ni-header">
          <button className="ni-header__back" type="button" onClick={() => navigate('/wishlist')} aria-label="Voltar">
            <svg viewBox="0 0 24 24" fill="none" strokeWidth="2.5" aria-hidden="true">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <h1 className="ni-header__title">Novo Item</h1>
        </header>

        <form className="ni-form" onSubmit={handleSubmit} noValidate>

          <div className="ni-group">
            <label className="ni-label" htmlFor="ni-name">Nome do item</label>
            <input id="ni-name" className="ni-input" type="text" placeholder="Ex: MacBook Pro M3"
              value={formData.name} onChange={(e) => handleChange('name', e.target.value)} />
          </div>

          <div className="ni-group">
            <label className="ni-label" htmlFor="ni-price">Preço</label>
            <div className="ni-price-wrap">
              <span className="ni-price-prefix">R$</span>
              <input id="ni-price" className="ni-price-input" type="text" inputMode="numeric"
                placeholder="0,00" value={displayPrice()} onChange={handlePriceChange} />
            </div>
          </div>

          <div className="ni-group">
            <label className="ni-label">Categoria</label>
            <div className="ni-chips">
              {categories.map((cat) => (
                <button key={cat} type="button"
                  className={`ni-chip${activeCategory === cat ? ' ni-chip--active' : ''}`}
                  onClick={() => { setActiveCategory(cat); handleChange('category', cat) }}>
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="ni-group">
            <label className="ni-label">Prioridade</label>
            <div className="ni-priority-row">
              {WISHLIST_PRIORITY_OPTIONS.map((p) => {
                const isActive = activePriority === p.value
                return (
                  <button key={p.value} type="button"
                    className={`ni-priority-card${isActive ? ' ni-priority-card--active' : ''}`}
                    style={isActive ? { '--border-color': p.color, '--bg-color': `${p.color}18` } : {}}
                    onClick={() => { setActivePriority(p.value); handleChange('priority', p.value) }}>
                    <span className="ni-priority-dot" style={{ background: p.color }} />
                    <span className="ni-priority-label">{p.label}</span>
                  </button>
                )
              })}
            </div>
          </div>

          <div className="ni-group">
            <label className="ni-label" htmlFor="ni-link">Link (opcional)</label>
            <input id="ni-link" className="ni-input" type="url" placeholder="https://..."
              value={formData.link} onChange={(e) => handleChange('link', e.target.value)} />
          </div>

          <div className="ni-group">
            <label className="ni-label" htmlFor="ni-notes">Notas</label>
            <textarea id="ni-notes" className="ni-textarea" rows={3}
              placeholder="Observações sobre o item..."
              value={formData.notes} onChange={(e) => handleChange('notes', e.target.value)} />
          </div>

          <button type="submit" className="ni-submit" disabled={isSubmitting}>
            <svg viewBox="0 0 24 24" fill="none" strokeWidth="2.5" aria-hidden="true">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            {isSubmitting ? 'Salvando...' : 'Salvar Item'}
          </button>

        </form>

        <div className="ni-spacer" />
      </div>

      <BottomNav />
    </div>
  )
}
