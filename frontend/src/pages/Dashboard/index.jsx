import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './dashboard.css'
import BottomNav from '../BottomNav'
import { MOCK_BALANCE, MOCK_EXPENSES, formatCurrency } from '../../data/mockData'

const IconEye = () => (
  <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" />
    <circle cx="12" cy="12" r="3" stroke="currentColor" />
  </svg>
)

const IconEyeOff = () => (
  <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" stroke="currentColor" />
    <line x1="1" y1="1" x2="23" y2="23" stroke="currentColor" />
  </svg>
)

const IconTrendUp = () => (
  <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" stroke="currentColor" />
    <polyline points="17 6 23 6 23 12" stroke="currentColor" />
  </svg>
)

const IconChevronRight = () => (
  <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6" stroke="currentColor" />
  </svg>
)

const IconChart = () => (
  <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="20" x2="18" y2="10" stroke="currentColor" />
    <line x1="12" y1="20" x2="12" y2="4" stroke="currentColor" />
    <line x1="6" y1="20" x2="6" y2="14" stroke="currentColor" />
  </svg>
)

const IconWallet = () => (
  <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 12V8H6a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2v-4" stroke="currentColor" />
    <path d="M4 10V6a2 2 0 012-2h14" stroke="currentColor" />
    <circle cx="16" cy="14" r="2" stroke="currentColor" />
  </svg>
)

const IconArrowDown = () => (
  <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19" stroke="currentColor" />
    <polyline points="19 12 12 19 5 12" stroke="currentColor" />
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

export default function Dashboard() {
  const navigate = useNavigate()
  const [balanceVisible, setBalanceVisible] = useState(true)

  const toggleBalance = () => setBalanceVisible((v) => !v)

  const displayBalance = balanceVisible
    ? formatCurrency(MOCK_BALANCE.total)
    : 'R$ ••••••'

  return (
    <div className="db-root">
      {/* ── decorações de fundo ── */}
      <div className="db-deco" aria-hidden="true">
        <div className="db-deco__orb db-deco__orb--1" />
        <div className="db-deco__orb db-deco__orb--2" />
      </div>

      <div className="db-shell">
        {/* ── header / saudação ── */}
        <header className="db-header">
          <div className="db-header__user">
            <div className="db-header__avatar">
              <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.5">
                <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" stroke="currentColor" />
                <circle cx="12" cy="7" r="4" stroke="currentColor" />
              </svg>
            </div>
            <div className="db-header__greeting">
              <span className="db-header__hello">
                Olá, Juninho👋
              </span>
              <span className="db-header__welcome">bem-vindo de volta!</span>
            </div>
          </div>
        </header>

        {/* ── saldo total ── */}
        <section className="db-balance">
          <div className="db-balance__label">Saldo Total</div>
          <div className="db-balance__row">
            <span className="db-balance__amount">{displayBalance}</span>
            <button
              className="db-balance__toggle"
              onClick={toggleBalance}
              aria-label={balanceVisible ? 'Ocultar saldo' : 'Mostrar saldo'}
            >
              {balanceVisible ? <IconEye /> : <IconEyeOff />}
            </button>
          </div>
          <div className="db-balance__variation">
            <span className="db-balance__trend-icon">
              <IconTrendUp />
            </span>
            <span className="db-balance__trend-text">
              +{MOCK_BALANCE.variation}% vs mês passado
            </span>
          </div>
        </section>

        {/* ── resumo do mês ── */}
        <section className="db-section">
          <h2 className="db-section__title">Resumo do mês</h2>
          <div className="db-summary-card">
            <button
              className="db-summary-row"
              onClick={() => navigate('/reports')}
            >
              <div className="db-summary-row__left">
                <span className="db-summary-row__icon db-summary-row__icon--income">
                  <IconChart />
                </span>
                <div className="db-summary-row__info">
                  <span className="db-summary-row__label">Receitas</span>
                  <span className="db-summary-row__value db-summary-row__value--income">
                    {formatCurrency(MOCK_BALANCE.summary.receitas)}
                  </span>
                </div>
              </div>
              <span className="db-summary-row__arrow">
                <IconChevronRight />
              </span>
            </button>

            <div className="db-summary-divider" />

            <button
              className="db-summary-row"
              onClick={() => navigate('/reports')}
            >
              <div className="db-summary-row__left">
                <span className="db-summary-row__icon db-summary-row__icon--expense">
                  <IconArrowDown />
                </span>
                <div className="db-summary-row__info">
                  <span className="db-summary-row__label">Despesas</span>
                  <span className="db-summary-row__value db-summary-row__value--expense">
                    {formatCurrency(MOCK_BALANCE.summary.despesas)}
                  </span>
                </div>
              </div>
              <span className="db-summary-row__arrow">
                <IconChevronRight />
              </span>
            </button>

            <div className="db-summary-divider" />

            <button
              className="db-summary-row"
              onClick={() => navigate('/reports')}
            >
              <div className="db-summary-row__left">
                <span className="db-summary-row__icon db-summary-row__icon--balance">
                  <IconWallet />
                </span>
                <div className="db-summary-row__info">
                  <span className="db-summary-row__label">Saldo</span>
                  <span className="db-summary-row__value db-summary-row__value--balance">
                    {formatCurrency(MOCK_BALANCE.summary.saldo)}
                  </span>
                </div>
              </div>
              <span className="db-summary-row__arrow">
                <IconChevronRight />
              </span>
            </button>
          </div>
        </section>

        {/* ── últimas despesas ── */}
        <section className="db-section">
          <h2 className="db-section__title">Últimas despesas</h2>
          <div className="db-expenses-card">
            {MOCK_EXPENSES.slice(0, 3).map((expense, idx) => (
              <button
                key={expense.id}
                className="db-expense-row"
                onClick={() => navigate('/reports')}
              >
                <div className="db-expense-row__left">
                  <span className="db-expense-row__icon">
                    {getExpenseIcon(expense.icon)}
                  </span>
                  <div className="db-expense-row__info">
                    <span className="db-expense-row__name">{expense.name}</span>
                    <span className="db-expense-row__amount">
                      {formatCurrency(expense.amount)}
                    </span>
                  </div>
                </div>
                <span className="db-expense-row__arrow">
                  <IconChevronRight />
                </span>
                {idx < 2 && (
                  <div className="db-expense-divider" />
                )}
              </button>
            ))}
          </div>
        </section>

        {/* ── espaço para o bottom nav ── */}
        <div className="db-spacer" />
      </div>

      {/* ── bottom navigation ── */}
      <BottomNav active="home" />
    </div>
  )
}
