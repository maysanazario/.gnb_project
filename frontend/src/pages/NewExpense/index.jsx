import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './newexpense.css'

export default function NewExpense() {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: '',
    notes: '',
  })

  const [activeCategory, setActiveCategory] = useState('')

  const categories = ['Casa', 'Compras', 'Alimentação', 'Outros']

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
    if (!formData.name) return alert('Por favor, informe o nome da despesa')
    if (!formData.price || parseFloat(formData.price) === 0)
      return alert('Por favor, informe o preço da despesa')
    if (!formData.category) return alert('Por favor, selecione uma categoria')

    console.log('Nova despesa:', { ...formData, price: parseFloat(formData.price) })
    alert('✨ Despesa registrada com sucesso!')
    navigate('/dashboard')
  }

  return (
    <div className="ne-root">
      {/* ── decorações ── */}
      <div className="ne-deco" aria-hidden="true">
        <div className="ne-deco__orb" />
      </div>

      <div className="ne-shell">
        {/* ── header ── */}
        <header className="ne-header">
          <button
            className="ne-header__back"
            type="button"
            onClick={() => navigate('/dashboard')}
            aria-label="Voltar"
          >
            <svg viewBox="0 0 24 24" fill="none" strokeWidth="2.5" aria-hidden="true">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <h1 className="ne-header__title">Nova Despesa</h1>
        </header>

        {/* ── formulário ── */}
        <form className="ne-form" onSubmit={handleSubmit} noValidate>

          {/* Nome */}
          <div className="ne-group">
            <label className="ne-label" htmlFor="ne-name">Nome da Despesa</label>
            <input
              id="ne-name"
              className="ne-input"
              type="text"
              placeholder="Ex: Conta de Luz"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
            />
          </div>

          {/* Preço */}
          <div className="ne-group">
            <label className="ne-label" htmlFor="ne-price">Preço</label>
            <div className="ne-price-wrap">
              <input
                id="ne-price"
                className="ne-price-input"
                type="text"
                inputMode="numeric"
                placeholder="0,00"
                value={displayPrice()}
                onChange={handlePriceChange}
              />
            </div>
          </div>

          {/* Categoria */}
          <div className="ne-group">
            <label className="ne-label">Categoria</label>
            <div className="ne-chips">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  className={`ne-chip${activeCategory === cat ? ' ne-chip--active' : ''}`}
                  onClick={() => { setActiveCategory(cat); handleChange('category', cat) }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Notas */}
          <div className="ne-group">
            <label className="ne-label" htmlFor="ne-notes">Notas</label>
            <textarea
              id="ne-notes"
              className="ne-textarea"
              placeholder="Observações sobre o item..."
              rows={3}
              value={formData.notes}
              onChange={(e) => handleChange('notes', e.target.value)}
            />
          </div>

          {/* Submit */}
          <button type="submit" className="ne-submit">
            <svg viewBox="0 0 24 24" fill="none" strokeWidth="2.5" aria-hidden="true">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            Salvar Despesa
          </button>

        </form>
      </div>
    </div>
  )
}
