import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import logo from '../../assets/img/Logo_gnb.png'
import './register.css'

export default function Register() {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [apiError, setApiError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setApiError('')

    if (password !== confirmPassword) {
      setApiError('As senhas não coincidem!')
      return
    }

    if (password.length < 8) {
      setApiError('A senha deve ter no mínimo 8 caracteres')
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        setApiError(data?.message || data?.errors?.[0] || 'Erro ao realizar cadastro')
        return
      }

      // Salva os tokens para uso nas requisições autenticadas (wishlist, etc.)
      localStorage.setItem('token', data.data.token)
      localStorage.setItem('refresh_token', data.data.refresh_token)

      navigate('/onboard')
    } catch {
      setApiError('Erro de conexão. Verifique sua internet e tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  const EyeIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )

  const EyeOffIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
      <line x1="3" y1="3" x2="21" y2="21" />
    </svg>
  )

  return (
    <div className="screen">
      <div className="deco" aria-hidden="true">
        <svg viewBox="0 0 400 860" preserveAspectRatio="xMidYMid slice">
          <polygon points="55,18 90,78 20,78" fill="#3b2f6e" />
          <circle cx="348" cy="38" r="30" fill="none" stroke="#2a2650" strokeWidth="2.5" />
        </svg>
      </div>

      <div className="logo-area">
        <Link to="/">
          <img src={logo} alt=".gnb" className="logo-img" />
        </Link>
      </div>

      <div className="card">
        <h1>Cadastro</h1>

        <form onSubmit={handleSubmit}>
          <label className="label">Nome</label>
          <div className="input-wrap input-name">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Seu nome"
              required
              disabled={isLoading}
            />
          </div>

          <label className="label">Email</label>
          <div className="input-wrap input-email">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@e-mail.com"
              required
              disabled={isLoading}
            />
          </div>

          <label className="label">Senha</label>
          <div className="input-wrap input-pass">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mínimo 8 caracteres"
              required
              disabled={isLoading}
            />
            <button type="button" className="eye-btn" onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}>
              {showPassword ? <EyeOffIcon /> : <EyeIcon />}
            </button>
          </div>

          <label className="label">Confirmar senha</label>
          <div className="input-wrap input-pass">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              required
              disabled={isLoading}
            />
            <button type="button" className="eye-btn" onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              aria-label={showConfirmPassword ? 'Ocultar senha' : 'Mostrar senha'}>
              {showConfirmPassword ? <EyeOffIcon /> : <EyeIcon />}
            </button>
          </div>

          {apiError && (
            <p className="error-message" style={{ marginBottom: '16px' }}>⚠️ {apiError}</p>
          )}

          <button type="submit" className="btn-entrar" disabled={isLoading}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <polyline points="16 11 19 14 23 10" />
            </svg>
            {isLoading ? 'Criando conta...' : 'Criar conta'}
          </button>
        </form>

        <p className="signup">
          Já tem conta? <Link to="/login">Entrar</Link>
        </p>
      </div>
    </div>
  )
}
