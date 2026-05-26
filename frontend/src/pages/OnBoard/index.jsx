import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './onboard.css'
import logo from '../../assets/img/Logo_gnb.png'

export default function MonthlyIncome() {
  const navigate = useNavigate()
  const [monthlyIncome, setMonthlyIncome] = useState(3000)
  const [incomeInput, setIncomeInput] = useState('3.000')

  const commonValues = [1500, 2000, 2500]

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value)
  }

  const handleIncomeChange = (e) => {
    let value = e.target.value.replace(/\D/g, '')
    if (value === '') value = '0'
    const numberValue = parseInt(value, 10)
    setMonthlyIncome(numberValue)
    setIncomeInput(numberValue.toLocaleString('pt-BR'))
  }

  const handleCommonValueClick = (value) => {
    setMonthlyIncome(value)
    setIncomeInput(value.toLocaleString('pt-BR'))
  }

  const handleContinue = () => {
    console.log({ monthlyIncome })
    navigate('/dashboard')
    // TODO: salvar no backend
    // navigate('/next-step')
  }

  return (
    <div className="screen">

      {/* Decorações de fundo */}
      <div className="deco" aria-hidden="true">
        <svg viewBox="0 0 400 860" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
          <polygon points="55,18 90,78 20,78" fill="#3b2f6e" />
          <circle cx="348" cy="38" r="30" fill="none" stroke="#2a2650" strokeWidth="2.5" />
          <circle cx="368" cy="160" r="60" fill="none" stroke="#221f40" strokeWidth="2" />
          <circle cx="22" cy="170" r="40" fill="#161428" />
          <polygon points="30,340 55,390 5,390" fill="#1e1a38" opacity="0.7" />
          <circle cx="50" cy="600" r="80" fill="none" stroke="#2a2650" strokeWidth="2" />
        </svg>
      </div>

      {/* Logo */}
      <div className="logo-area">
        <img src={logo} alt=".gnb" className="logo-img" />
      </div>

      {/* Card */}
      <div className="card income-card">
        
        {/* Título */}
        <h1 className="income-title">QUAL A SUA RENDA MENSAL?</h1>
        
        <p className="income-description">
          Usamos isso para calcular quanto você pode<br />
          gastar e poupar durante o mês.
        </p>

        {/* Input de renda */}
        <div className="income-input-section">
          <label className="income-label">RENDA MENSAL</label>
          <div className="currency-input-wrap">
            <span className="currency-symbol">R$</span>
            <input
              type="text"
              value={incomeInput}
              onChange={handleIncomeChange}
              className="currency-input"
              placeholder="0"
            />
          </div>
        </div>

        {/* Valores comuns */}
        <div className="common-values">
          <p className="common-label">VALORES COMUNS</p>
          <div className="value-buttons">
            {commonValues.map((value) => (
              <button
                key={value}
                type="button"
                className={`value-btn ${monthlyIncome === value ? 'active' : ''}`}
                onClick={() => handleCommonValueClick(value)}
              >
                {formatCurrency(value)}
              </button>
            ))}
          </div>
        </div>

        {/* Descrição final */}
        <p className="income-note">
          Inclua salário, freelas e outras fontes de<br />
          renda recorrentes.
        </p>

        {/* Botão continuar */}
        <button type="button" onClick={handleContinue} className="btn-continuar">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
          Continuar
        </button>

      </div>
    </div>
  )
}