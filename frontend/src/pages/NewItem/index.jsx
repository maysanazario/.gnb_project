import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './newitem.css'

export default function NewItem() {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: '',
    priority: '',
    link: '',
    notes: '',
  })

  const [activeCategory, setActiveCategory] = useState('')
  const [activePriority, setActivePriority] = useState('')

  const categories = ['Eletrônico', 'Moda', 'Casa', 'Livros', 'Outros']

  const priorities = [
    { value: 'alta',  label: 'Alta',  color: '#ef4444' },
    { value: 'media', label: 'Média', color: '#f59e0b' },
    { value: 'baixa', label: 'Baixa', color: '#10b981' },
  ]

  const handleChange = (field, value) =>
    setFormData((prev) => ({ ...prev, [field]: value }))

  const handlePriceChange = (e) => {
    const raw = e.target.value.replace(/\D/g, '')
    if (!raw) { handleChange('price', ''); return }
    const num = (parseInt(raw) / 100).toFixed(2)
    handleChange('price', num)
  }

  const displayPrice = () => {
    if (!formData.price) return ''
    return formData.price.replace('.', ',')
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.name)    return alert('Por favor, informe o nome do item')
    if (!formData.price || parseFloat(formData.price) === 0)
                           return alert('Por favor, informe o preço do item')
    if (!formData.category) return alert('Por favor, selecione uma categoria')
    if (!formData.priority) return alert('Por favor, selecione a prioridade')

    console.log('Novo item:', { ...formData, price: parseFloat(formData.price) })
    alert('✨ Item adicionado com sucesso!')
    navigate('/wishlistOne')
  }

  return (
    <div className="ni-root">
      {/* ── decorações ── */}
      <div className="ni-deco" aria-hidden="true">
        <div className="ni-deco__dot" />
        <div className="ni-deco__diamond" />
        <div className="ni-deco__diamond ni-deco__diamond--sm" />
      </div>

      <div className="ni-shell">
        {/* ── header ── */}
        <header className="ni-header">
          <button
            className="ni-header__back"
            type="button"
            onClick={() => navigate('/wishlistOne')}
            aria-label="Voltar"
          >
            <svg viewBox="0 0 24 24" fill="none" strokeWidth="2.5" aria-hidden="true">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <h1 className="ni-header__title">Novo Item</h1>
        </header>

        {/* ── formulário ── */}
        <form className="ni-form" onSubmit={handleSubmit} noValidate>

          {/* Nome */}
          <div className="ni-group">
            <label className="ni-label" htmlFor="ni-name">Nome do item</label>
            <input
              id="ni-name"
              className="ni-input"
              type="text"
              placeholder="Ex: MacBook Pro M3"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
            />
          </div>

          {/* Preço */}
          <div className="ni-group">
            <label className="ni-label" htmlFor="ni-price">Preço</label>
            <div className="ni-price-wrap">
              <span className="ni-price-prefix">0,00</span>
              <input
                id="ni-price"
                className="ni-price-input"
                type="text"
                inputMode="numeric"
                placeholder="0,00"
                value={displayPrice()}
                onChange={handlePriceChange}
              />
            </div>
          </div>

          {/* Categoria */}
          <div className="ni-group">
            <label className="ni-label">Categoria</label>
            <div className="ni-chips">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  className={`ni-chip${activeCategory === cat ? ' ni-chip--active' : ''}`}
                  onClick={() => { setActiveCategory(cat); handleChange('category', cat) }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Prioridade */}
          <div className="ni-group">
            <label className="ni-label">Prioridade</label>
            <div className="ni-priority-row">
              {priorities.map((p) => {
                const isActive = activePriority === p.value
                const dotColor = p.color
                return (
                  <button
                    key={p.value}
                    type="button"
                    className={`ni-priority-card${isActive ? ' ni-priority-card--active' : ''}`}
                    style={isActive ? { '--border-color': p.color, '--bg-color': `${p.color}18` } : {}}
                    onClick={() => { setActivePriority(p.value); handleChange('priority', p.value) }}
                  >
                    <span
                      className="ni-priority-dot"
                      style={{ background: dotColor }}
                    />
                    <span className="ni-priority-label">{p.label}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Link */}
          <div className="ni-group">
            <label className="ni-label" htmlFor="ni-link">Link (opcional)</label>
            <input
              id="ni-link"
              className="ni-input"
              type="url"
              placeholder="https://..."
              value={formData.link}
              onChange={(e) => handleChange('link', e.target.value)}
            />
          </div>

          {/* Notas */}
          <div className="ni-group">
            <label className="ni-label" htmlFor="ni-notes">Notas</label>
            <textarea
              id="ni-notes"
              className="ni-textarea"
              placeholder="Observações sobre o item..."
              rows={3}
              value={formData.notes}
              onChange={(e) => handleChange('notes', e.target.value)}
            />
          </div>

          {/* Submit */}
          <button type="submit" className="ni-submit">
            <svg viewBox="0 0 24 24" fill="none" strokeWidth="2.5" aria-hidden="true">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            Salvar Item
          </button>

        </form>
      </div>
    </div>
  )
}