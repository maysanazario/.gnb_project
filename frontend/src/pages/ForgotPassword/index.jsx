import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './forgotpassword.css'
import logo from '../../assets/img/Logo_gnb.png'

export default function ForgotPassword() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [emailError, setEmailError] = useState('')
  const [touchedEmail, setTouchedEmail] = useState(false)
  const [sent, setSent] = useState(false)

  // ── Validação do email em tempo real ──
  const validateEmail = (value) => {
    if (!touchedEmail) return ''
    if (value === '') return 'Digite um e-mail válido'
    if (!value.includes('@') || !value.includes('.')) return 'Digite um e-mail válido'
    return ''
  }

  const handleEmailChange = (e) => {
    const value = e.target.value
    setEmail(value)
    setEmailError(validateEmail(value))
  }

  const handleEmailBlur = () => {
    setTouchedEmail(true)
    setEmailError(validateEmail(email))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setTouchedEmail(true)

    const isEmailValid = email !== '' && email.includes('@') && email.includes('.')
    if (!isEmailValid) {
      setEmailError('Digite um e-mail válido')
      return
    }

    // TODO: conectar com API de recuperação de senha
    console.log('Recuperação solicitada para:', email)
    setSent(true)
  }

  return (
    <div className="fp-screen">
      {/* ── Decorações de fundo ── */}
      <div className="fp-deco" aria-hidden="true">
        <svg viewBox="0 0 400 860" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
          <polygon points="55,18 90,78 20,78" fill="#3b2f6e" />
          <circle cx="348" cy="38" r="30" fill="none" stroke="#2a2650" strokeWidth="2.5" />
          <circle cx="368" cy="160" r="60" fill="none" stroke="#221f40" strokeWidth="2" />
          <circle cx="22" cy="170" r="40" fill="#161428" />
          <polygon points="30,340 55,390 5,390" fill="#1e1a38" opacity="0.7" />
        </svg>
      </div>

      {/* ── Logo ── */}
      <div className="fp-logo-area">
        <img src={logo} alt=".gnb" className="fp-logo-img" />
      </div>

      {/* ── Card ── */}
      <div className="fp-card">
        <button
          className="fp-back"
          onClick={() => navigate('/login')}
          aria-label="Voltar para login"
        >
          <svg viewBox="0 0 24 24" fill="none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6" stroke="currentColor" />
          </svg>
        </button>

        <h1 className="fp-title">Recuperar senha</h1>
        <p className="fp-description">
          Digite seu email abaixo e enviaremos um link para redefinir sua senha.
        </p>

        {!sent ? (
          <form onSubmit={handleSubmit}>
            <label className="fp-label" htmlFor="fp-email">Email</label>
            <div className={`fp-input-wrap ${emailError ? 'fp-error' : ''}`}>
              <input
                id="fp-email"
                type="email"
                value={email}
                onChange={handleEmailChange}
                onBlur={handleEmailBlur}
                autoComplete="email"
                placeholder="seu@e-mail.com"
              />
              {emailError && (
                <span className="fp-error-message">⚠️ {emailError}</span>
              )}
            </div>

            <button type="submit" className="fp-btn">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
              Enviar link
            </button>
          </form>
        ) : (
          <div className="fp-success">
            <div className="fp-success__icon">
              <svg viewBox="0 0 24 24" fill="none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" stroke="currentColor" />
              </svg>
            </div>
            <h2 className="fp-success__title">Email enviado!</h2>
            <p className="fp-success__text">
              Verifique sua caixa de entrada e siga as instruções para redefinir sua senha.
            </p>
            <button
              className="fp-btn fp-btn--secondary"
              onClick={() => navigate('/login')}
            >
              Voltar para o login
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
