import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './login.css'
import logo from '../../assets/img/Logo_gnb.png'

export default function Login() {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const [emailError, setEmailError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [touchedEmail, setTouchedEmail] = useState(false)
  const [touchedPassword, setTouchedPassword] = useState(false)

  const navigate = useNavigate()

  const validateEmail = (value) => {
    if (!touchedEmail) return ''
    if (value === '') {
      return 'Digite um email válido'
    }
    if (!value.includes('@') || !value.includes('.')) {
      return 'Digite um email válido'
    }
    return ''
  }

  const validatePassword = (value) => {
    if (!touchedPassword) return ''
    if (value === '') {
      return 'Senha obrigatória'
    }
    return ''
  }

  const handleEmailChange = (e) => {
    const value = e.target.value
    setEmail(value)
    setEmailError(validateEmail(value))
  }

  const handlePasswordChange = (e) => {
    const value = e.target.value
    setPassword(value)
    setPasswordError(validatePassword(value))
  }

  const handleEmailBlur = () => {
    setTouchedEmail(true)
    setEmailError(validateEmail(email))
  }

  const handlePasswordBlur = () => {
    setTouchedPassword(true)
    setPasswordError(validatePassword(password))
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    setTouchedEmail(true)
    setTouchedPassword(true)

    const isEmailValid = email !== '' && email.includes('@') && email.includes('.')
    const isPasswordValid = password !== ''

    if (!isEmailValid) {
      setEmailError('Digite um email válido')
    }
    if (!isPasswordValid) {
      setPasswordError('Senha obrigatória')
    }

    if (isEmailValid && isPasswordValid) {
      console.log({ email, password })
      navigate('/dashboard')
    }
  }

  const handleForgotPassword = () => {
    navigate('/forgot-password')
  }

  const handleSignUp = () => {
    navigate('/register')
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
        </svg>
      </div>

      {/* Logo */}
      <div className="logo-area">
        <img src={logo} alt=".gnb" className="logo-img" />
      </div>

      {/* Card */}
      <div className="card">
        <h1>Login</h1>

        <form onSubmit={handleSubmit}>
          <label className="label" htmlFor="email">Email</label>
          <div className={`input-wrap input-email ${emailError ? 'error' : ''}`}>
            <input
              id="email"
              type="email"
              value={email}
              onChange={handleEmailChange}
              onBlur={handleEmailBlur}
              autoComplete="email"
              placeholder='Digite seu email'
            />
            {emailError && (
              <span className="error-message">⚠️ {emailError}</span>
            )}
          </div>

          <label className="label" htmlFor="senha">Senha</label>
          <div className={`input-wrap input-pass ${passwordError ? 'error' : ''}`}>
            <input
              id="senha"
              type={showPassword ? 'text' : 'password'}
              placeholder="Digite sua senha"
              value={password}
              onChange={handlePasswordChange}
              onBlur={handlePasswordBlur}
              autoComplete="current-password"
            />
            <button
              type="button"
              className="eye-btn"
              onClick={() => setShowPassword(!showPassword)}
              aria-label="Mostrar/ocultar senha"
            >
              {showPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.477 0-8.268-2.943-9.542-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88L3 3m6.88 6.88L21 21" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              )}
            </button>
            {passwordError && (
              <span className="error-message">⚠️ {passwordError}</span>
            )}
          </div>

          <div className="forgot">
            <button type="button" onClick={handleForgotPassword} className="link-button">
              Esqueci minha senha
            </button>
          </div>

          <button type="submit" className="btn-entrar">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
            </svg>
            Entrar
          </button>
        </form>

        <p className="signup">
          Não tem conta? <button type="button" onClick={handleSignUp} className="link-button">Cadastre-se</button>
        </p>
      </div>

    </div>
  )
}
