// frontend/src/App.js
import { Routes, Route, Navigate } from 'react-router-dom'
import Login from '../src/pages/Login'
import Register from '../src/pages/Register'
import OnBoard from '../src/pages/OnBoard'
import ChatBot from '../src/pages/ChatBot'
import WishList from './pages/WishList'
import NewItem from './pages/NewItem'
import WishlistItem from './pages/WishList-Item'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/onboard" element={<OnBoard />} />
      <Route path="/chatbot" element={<ChatBot />} />
      <Route path="/wishlist" element={<WishList />} />
      <Route path="/newitem" element={<NewItem />} />
      <Route path="/wishlist-item" element={< WishlistItem/>} />
    </Routes>
  )
}

export default App;