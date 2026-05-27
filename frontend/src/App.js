// frontend/src/App.js
// ── ROTEAMENTO PRINCIPAL DO APP ──
// Todas as rotas do projeto GNB

import { Routes, Route, Navigate } from 'react-router-dom'

// ── Telas de Autenticação ──
import Login from './pages/Login'
import Register from './pages/Register'
import ForgotPassword from './pages/ForgotPassword'
import OnBoard from './pages/OnBoard'

// ── Telas Principais (com BottomNav) ──
import Dashboard from './pages/Dashboard'
import Transactions from './pages/Transactions'
import Reports from './pages/Reports'
import ChatBot from './pages/ChatBot'
import WishList from './pages/WishList'
import NewItem from './pages/NewItem'
import WishlistItem from './pages/WishList-Item'
import NewExpense from './pages/NewExpense'
import Settings from './pages/Settings'

function App() {
  return (
    <Routes>
      {/* ── Redirecionamento raiz ── */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* ── Fluxo de Autenticação ── */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/onboard" element={<OnBoard />} />

      {/* ── Telas Principais ── */}
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/transactions" element={<Transactions />} />
      <Route path="/reports" element={<Reports />} />
      <Route path="/chatbot" element={<ChatBot />} />

      {/* ── Wishlist ── */}
      <Route path="/wishlist" element={<WishList />} />
      <Route path="/newitem" element={<NewItem />} />
      <Route path="/wishlist-item/:id" element={<WishlistItem />} />

      {/* ── Despesas ── */}
      <Route path="/newexpense" element={<NewExpense />} />

      {/* ── Configurações ── */}
      <Route path="/settings" element={<Settings />} />

      {/* ── Fallback: qualquer rota desconhecida vai pro dashboard ── */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}

export default App
