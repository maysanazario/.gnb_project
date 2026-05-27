import { Routes, Route, Navigate } from 'react-router-dom'
import Login from '../src/pages/Login'
import Register from '../src/pages/Register'
import OnBoard from '../src/pages/OnBoard'
import DashBoard from '../src/pages/DashBoard'
import ChatBot from '../src/pages/ChatBot'
import WishList from './pages/WishList'
import NewExpense from './pages/NewExpense'
import NewItem from './pages/NewItem'
import WishlistItem from './pages/WishList-Item'
import Reports from './pages/Reports'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/onboard" element={<OnBoard />} />
      <Route path="/dashboard" element={<DashBoard />} />
      <Route path="/chatbot" element={<ChatBot />} />
      <Route path="/wishlist" element={<WishList />} />
      <Route path="/newitem" element={<NewItem />} />
      <Route path="/newexpense" element={<NewExpense />} />
      <Route path="/wishlist-item" element={<WishlistItem />} />
      <Route path="/reports" element={<Reports />} />
    </Routes>
  )
}

export default App;
