const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const UserController = require('./controllers/UserController');
const AuthController = require('./controllers/AuthController');
const AuthMiddleware = require('./middlewares/AuthMiddleware');
const { validateRegistration } = require('./middlewares/validation');
const wishlistRouter = require('./routes/wishlist');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
}));

// ==================== ROTAS PÚBLICAS ====================

app.post('/api/register', validateRegistration, (req, res) => UserController.register(req, res));
app.post('/api/login', (req, res) => AuthController.login(req, res));
app.post('/api/refresh', (req, res) => AuthController.refreshToken(req, res));

// ==================== ROTAS PROTEGIDAS ====================

app.post('/api/logout', AuthMiddleware.authenticate, (req, res) => AuthController.logout(req, res));
app.get('/api/users/me', AuthMiddleware.authenticate, (req, res) => UserController.getMe(req, res));
app.patch('/api/users/me', AuthMiddleware.authenticate, (req, res) => UserController.updateMe(req, res));

// ==================== ROTAS DE WISHLIST ====================
// TODO: adicionar AuthMiddleware.authenticate quando userId for integrado ao WishlistItem

app.use('/api/wishlist', wishlistRouter);

// ==================== ROTA DE TESTE ====================

app.get('/', (req, res) => {
  res.json({
    message: 'API GNB funcionando!',
    status: 'online',
    version: '1.0.0',
    endpoints: {
      publicos: {
        register: 'POST /api/register',
        login: 'POST /api/login',
        refresh: 'POST /api/refresh',
      },
      protegidos: {
        logout: 'POST /api/logout',
        getMe: 'GET /api/users/me',
        updateMe: 'PATCH /api/users/me',
      },
      wishlist: {
        list:   'GET    /api/wishlist',
        get:    'GET    /api/wishlist/:id',
        create: 'POST   /api/wishlist',
        update: 'PUT    /api/wishlist/:id',
        delete: 'DELETE /api/wishlist/:id',
      },
    },
  });
});

// ==================== 404 ====================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'route_not_found',
    message: `Rota ${req.method} ${req.url} não encontrada`,
  });
});

// ==================== ERRO GLOBAL ====================

app.use((err, req, res, next) => {
  console.error('Erro não tratado:', err);
  res.status(500).json({
    success: false,
    error: 'internal_server_error',
    message: 'Ocorreu um erro interno no servidor',
  });
});

// ==================== MONGODB ====================

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/gnb';

mongoose.connect(MONGODB_URI)
  .then(() => console.log('✅ Conectado ao MongoDB com sucesso!'))
  .catch((error) => console.error('❌ Erro ao conectar ao MongoDB:', error.message));

// ==================== SERVIDOR ====================

const PORT = process.env.PORT || 4000;

const server = app.listen(PORT, () => {
  console.log(`\n🚀 Servidor rodando em http://localhost:${PORT}`);
  console.log(`\n📝 Documentação: http://localhost:${PORT}/\n`);
});

server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`Porta ${PORT} já está em uso. Execute 'npm run dev:clean' para liberar.`);
  } else {
    console.error(error);
  }
  process.exit(1);
});

module.exports = app;
