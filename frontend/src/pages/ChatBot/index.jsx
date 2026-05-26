import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import './chatbot.css'
import botAvatar from '../../assets/img/rei-do-troco.png'

const BotAvatar = () => (
  <div className="cb-avatar cb-avatar--bot">
    <img src={botAvatar} alt="Rei do Troco" className="cb-avatar__img" />
  </div>
)

const UserAvatar = () => (
  <div className="cb-avatar cb-avatar--user">
    <svg viewBox="0 0 36 36" fill="none" aria-hidden="true">
      <circle cx="18" cy="18" r="18" fill="#1e1b4b" />
      <circle cx="18" cy="15" r="6" fill="#a78bfa" />
      <path d="M6 32 Q8 24 18 24 Q28 24 30 32" fill="#a78bfa" />
    </svg>
  </div>
)

const BOT_RESPONSES = {
  saldo: `Seu saldo atual é **R$ 1.247,83** 💳\n\nConta Corrente: R$ 847,83\nPoupança: R$ 400,00`,
  poupar: `Você pode poupar cerca de **R$ 650/mês** 🐷\nRegra 50-30-20 aplicada à sua renda.\n\nEssenciais: 50% · Desejos: 30% · Poupança: 20%`,
  extrato: `📊 Extrato dos últimos 30 dias:\n\nSupermercado: R$ 347,90\nFarmácia: R$ 89,50\nRestaurante: R$ 124,70\nNetflix: R$ 39,90`,
  comprar: `Com base no seu orçamento, você tem **R$ 432,17** disponível para gastos não essenciais este mês. 💰\n\n✅ Recomendo esperar mais 5 dias para decisões grandes.`,
  default: `Não entendi muito bem. 😅\n\nVocê pode perguntar sobre:\n• saldo\n• quanto posso poupar?\n• extrato\n• devo comprar?`,
}

function getBotResponse(text) {
  const t = text.toLowerCase()
  if (t.includes('saldo') || t.includes('ver saldo')) return BOT_RESPONSES.saldo
  if (t.includes('poupar')) return BOT_RESPONSES.poupar
  if (t.includes('extrato')) return BOT_RESPONSES.extrato
  if (t.includes('comprar') || t.includes('compro')) return BOT_RESPONSES.comprar
  return BOT_RESPONSES.default
}

// Renderiza texto com **bold** simples
function MessageText({ text }) {
  return (
    <div className="cb-msg__text">
      {text.split('\n').map((line, i) => {
        const parts = line.split(/\*\*(.*?)\*\*/g)
        return (
          <p key={i}>
            {parts.map((part, j) =>
              j % 2 === 1 ? <strong key={j}>{part}</strong> : part
            )}
          </p>
        )
      })}
    </div>
  )
}

export default function ChatBot() {
  const navigate = useNavigate()
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      text: 'Olá, Juninho! 👋 Sou o Assistente do GNB.\nComo posso te ajudar?',
    },
  ])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  const sendMessage = (text) => {
    const trimmed = text.trim()
    if (!trimmed) return

    const userMsg = { id: Date.now(), type: 'user', text: trimmed }
    setMessages((prev) => [...prev, userMsg])
    setInputValue('')
    setIsTyping(true)

    setTimeout(() => {
      setIsTyping(false)
      const botMsg = { id: Date.now() + 1, type: 'bot', text: getBotResponse(trimmed) }
      setMessages((prev) => [...prev, botMsg])
    }, 900)

    inputRef.current?.focus()
  }

  const quickQuestions = [
    'ver saldo',
    'extrato',
    'devo comprar?',
  ]

  return (
    <div className="cb-root">
      {/* ── decorações ── */}
      <div className="cb-deco" aria-hidden="true">
        <div className="cb-deco__orb cb-deco__orb--1" />
        <div className="cb-deco__orb cb-deco__orb--2" />
      </div>

      <div className="cb-shell">
        {/* ── header ── */}
        <header className="cb-header">
          <button
            className="cb-header__back"
            type="button"
            onClick={() => navigate('/dashboard')}
            aria-label="Voltar"
          >
            <svg viewBox="0 0 24 24" fill="none" strokeWidth="2.5" aria-hidden="true">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>

          <div className="cb-header__bot">
            <BotAvatar />
            <div className="cb-header__info">
              <span className="cb-header__name">REI DO TROCO</span>
              <span className="cb-header__status">
                <span className="cb-header__dot" />
                online
              </span>
            </div>
          </div>
        </header>

        {/* ── mensagens ── */}
        <div className="cb-messages" role="log" aria-live="polite">
          {messages.map((msg, idx) => (
            <div
              key={msg.id}
              className={`cb-row cb-row--${msg.type}`}
              style={{ animationDelay: `${idx * 0.03}s` }}
            >
              {msg.type === 'bot' && <BotAvatar />}
              <div className={`cb-bubble cb-bubble--${msg.type}`}>
                <MessageText text={msg.text} />
              </div>
              {msg.type === 'user' && <UserAvatar />}
            </div>
          ))}

          {/* indicador de digitação */}
          {isTyping && (
            <div className="cb-row cb-row--bot">
              <BotAvatar />
              <div className="cb-bubble cb-bubble--bot cb-bubble--typing">
                <span /><span /><span />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* ── quick questions ── */}
        <div className="cb-quick" role="group" aria-label="Perguntas rápidas">
          {quickQuestions.map((q) => (
            <button
              key={q}
              className="cb-quick__btn"
              type="button"
              onClick={() => sendMessage(q)}
            >
              {q}
            </button>
          ))}
        </div>

        {/* ── input ── */}
        <div className="cb-input-area">
          <div className="cb-input-wrap">
            <input
              ref={inputRef}
              className="cb-input"
              type="text"
              placeholder="Digite sua mensagem..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage(inputValue)}
              aria-label="Mensagem"
            />
            <button
              className="cb-send"
              type="button"
              onClick={() => sendMessage(inputValue)}
              aria-label="Enviar"
            >
              <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" aria-hidden="true">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}