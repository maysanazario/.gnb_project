import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './reports.css'
import BottomNav from '../BottomNav'
import { MOCK_EXPENSES, formatCurrency } from '../../data/mockData'

const IconChevronRight = () => (
  <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6" stroke="currentColor" />
  </svg>
)

const IconCard = () => (
  <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="5" width="20" height="14" rx="3" stroke="currentColor" />
    <line x1="2" y1="10" x2="22" y2="10" stroke="currentColor" />
  </svg>
)

const IconHome = () => (
  <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" stroke="currentColor" />
    <polyline points="9 22 9 12 15 12 15 22" stroke="currentColor" />
  </svg>
)

const IconCart = () => (
  <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="21" r="1" stroke="currentColor" />
    <circle cx="20" cy="21" r="1" stroke="currentColor" />
    <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6" stroke="currentColor" />
  </svg>
)

const getCategoryIcon = (category) => {
  switch (category) {
    case 'Moradia': return <IconHome />
    case 'Entretenimento': return <IconCard />
    default: return <IconCart />
  }
}

const MOCK_CHART_DATA = [
  { day: 'Seg', value: 65, active: true },
  { day: 'Ter', value: 40, active: false },
  { day: 'Qua', value: 55, active: false },
  { day: 'Qui', value: 30, active: false },
  { day: 'Sex', value: 45, active: false },
  { day: 'Sáb', value: 25, active: false },
  { day: 'Dom', value: 35, active: false },
]

const MOCK_CATEGORIES = [
  { name: 'Assinaturas', amount: 44.90, icon: 'card' },
  { name: 'Casa', amount: 590.00, icon: 'home' },
  { name: 'Compras', amount: 138.90, icon: 'cart' },
]

export default function Reports() {
  const navigate = useNavigate()
  const [activePeriod, setActivePeriod] = useState('diário')

  const periods = [
    { id: 'diário', label: 'Diário' },
    { id: 'mensal', label: 'Mensal' },
    { id: 'anual', label: 'Anual' },
  ]

  const totalExpenses = MOCK_EXPENSES.reduce((sum, e) => sum + e.amount, 0)

  return (
    <div className="rp-root">
      {/* ── decorações ── */}
      <div className="rp-deco" aria-hidden="true">
        <div className="rp-deco__orb" />
      </div>

      <div className="rp-shell">
        {/* ── header ── */}
        <header className="rp-header">
          <button
            className="rp-header__back"
            onClick={() => navigate('/dashboard')}
            aria-label="Voltar"
          >
            <svg viewBox="0 0 24 24" fill="none" strokeWidth="2.5" aria-hidden="true">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <h1 className="rp-header__title">Relatórios</h1>
        </header>

        {/* ── períodos ── */}
        <div className="rp-periods">
          {periods.map((p) => (
            <button
              key={p.id}
              className={`rp-period${activePeriod === p.id ? ' rp-period--active' : ''}`}
              onClick={() => setActivePeriod(p.id)}
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* ── card de gráfico ── */}
        <div className="rp-chart-card">
          <span className="rp-chart-label">Total de Despesas</span>
          <span className="rp-chart-total">{formatCurrency(totalExpenses)}</span>

          <div className="rp-chart-bars">
            {MOCK_CHART_DATA.map((bar) => (
              <div key={bar.day} className="rp-bar-group">
                <div className="rp-bar-track">
                  <div
                    className={`rp-bar${bar.active ? ' rp-bar--active' : ''}`}
                    style={{ height: `${bar.value}%` }}
                  />
                </div>
                <span className="rp-bar-label">{bar.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── gastos por categoria ── */}
        <section className="rp-section">
          <h2 className="rp-section__title">Gastos por categoria</h2>
          <div className="rp-categories-card">
            {MOCK_CATEGORIES.map((cat, idx) => (
              <button
                key={cat.name}
                className="rp-category-row"
                onClick={() => {}}
              >
                <div className="rp-category-row__left">
                  <span className="rp-category-row__icon">
                    {getCategoryIcon(cat.name)}
                  </span>
                  <div className="rp-category-row__info">
                    <span className="rp-category-row__name">{cat.name}</span>
                    <span className="rp-category-row__amount">
                      {formatCurrency(cat.amount)}
                    </span>
                  </div>
                </div>
                <span className="rp-category-row__arrow">
                  <IconChevronRight />
                </span>
                {idx < MOCK_CATEGORIES.length - 1 && (
                  <div className="rp-category-divider" />
                )}
              </button>
            ))}
          </div>
        </section>

        {/* spacer */}
        <div className="rp-spacer" />
      </div>

      {/* ── bottom navigation ── */}
      <BottomNav active="reports" />
    </div>
  )
}
