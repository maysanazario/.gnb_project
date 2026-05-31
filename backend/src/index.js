const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const connectDB = require('./config/db')
const wishlistRoutes = require('./routes/wishlist')

dotenv.config()

const app = express()
const PORT = process.env.PORT || 4000

connectDB()

app.use(express.json())
app.use(
  cors({
    origin: process.env.FRONTEND_URL || '*',
  })
)

app.use('/api/wishlist', wishlistRoutes)

app.get('/', (req, res) => {
  res.send({ message: 'API WishList do GNB está no ar.' })
})

app.use((err, req, res, next) => {
  console.error(err)
  res.status(500).json({ error: 'Erro interno no servidor' })
})

const server = app.listen(PORT, () => {
  console.log(`Servidor backend rodando em http://localhost:${PORT}`)
})

server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`Porta ${PORT} já está em uso. Pare o processo que está usando essa porta ou execute 'npm run dev:clean'.`)
  } else {
    console.error(error)
  }
  process.exit(1)
})
