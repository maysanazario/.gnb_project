import { useNavigate } from 'react-router-dom'
import './transactions.css'
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

const getExpenseIcon = (iconType) => {
  switch (iconType) {
    case 'card': return <IconCard />
    case 'home': return <IconHome />
    case 'cart': return <IconCart />
    default: return <IconCard />
  }
}

export default function Transactions() {
  const navigate = useNavigate()

  const totalExpenses = MOCK_EXPENSES.reduce((sum, e) => sum + e.amount, 0)

  return (
    <div className="tx-root">
      {/* ── decorações ── */}
      <div className="tx-deco" aria-hidden="true">
        <div className="tx-deco__orb" />
      </div>

      <div className="tx-shell">
        {/* ── header ── */}
        <header className="tx-header">
          <button
            className="tx-header__back"
            onClick={() => navigate('/dashboard')}
            aria-label="Voltar"
          >
            <svg viewBox="0 0 24 24" fill="none" strokeWidth="2.5" aria-hidden="true">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <h1 className="tx-header__title">Transações</h1>
        </header>

        {/* ── resumo ── */}
        <div className="tx-summary">
          <span className="tx-summary__label">Total de despesas</span>
          <span className="tx-summary__value">{formatCurrency(totalExpenses)}</span>
        </div>

        {/* ── lista de transações ── */}
        <section className="tx-section">
          <h2 className="tx-section__title">Histórico</h2>
          <div className="tx-list-card">
            {MOCK_EXPENSES.map((expense, idx) => (
              <button
                key={expense.id}
                className="tx-item"
                onClick={() => {}}
              >
                <div className="tx-item__left">
                  <span className="tx-item__icon">
                    {getExpenseIcon(expense.icon)}
                  </span>
                  <div className="tx-item__info">
                    <span className="tx-item__name">{expense.name}</span>
                    <span className="tx-item__category">{expense.category}</span>
                  </div>
                </div>
                <div className="tx-item__right">
                  <span className="tx-item__amount">{formatCurrency(expense.amount)}</span>
                  <span className="tx-item__arrow">
                    <IconChevronRight />
                  </span>
                </div>
                {idx < MOCK_EXPENSES.length - 1 && (
                  <div className="tx-item-divider" />
                )}
              </button>
            ))}
          </div>
        </section>

        {/* spacer */}
        <div className="tx-spacer" />
      </div>

      {/* ── bottom navigation ── */}
      <BottomNav active="transactions" />
    </div>
  )
}
