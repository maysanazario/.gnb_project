const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const UserController = require('./controllers/UserController');
const AuthController = require('./controllers/AuthController');
const AuthMiddleware = require('./middlewares/AuthMiddleware');
const { validateRegistration } = require('./middlewares/validation');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ==================== ROTAS PÚBLICAS ====================

// Registro de usuário
app.post('/api/register', validateRegistration, (req, res) => UserController.register(req, res));

// Login
app.post('/api/login', (req, res) => AuthController.login(req, res));

// Refresh token
app.post('/api/refresh', (req, res) => AuthController.refreshToken(req, res));

// ==================== ROTAS PROTEGIDAS (requerem autenticação) ====================

// Logout (protegido)
app.post('/api/logout', AuthMiddleware.authenticate, (req, res) => AuthController.logout(req, res));

// Rotas de usuário protegidas
app.get('/api/users/me', AuthMiddleware.authenticate, (req, res) => UserController.getMe(req, res));
app.patch('/api/users/me', AuthMiddleware.authenticate, (req, res) => UserController.updateMe(req, res));

// ==================== ROTA DE TESTE ====================

app.get('/', (req, res) => {
  res.json({
    message: 'API de Autenticação funcionando!',
    status: 'online',
    version: '1.0.0',
    endpoints: {
      // Públicos
      register: {
        method: 'POST',
        url: '/api/register',
        body: { name: 'string', email: 'string', password: 'string (min 8)' }
      },
      login: {
        method: 'POST',
        url: '/api/login',
        body: { email: 'string', password: 'string' }
      },
      refresh: {
        method: 'POST',
        url: '/api/refresh',
        body: { refresh_token: 'string' }
      },
      // Protegidos (requerem Bearer token)
      logout: {
        method: 'POST',
        url: '/api/logout',
        headers: { Authorization: 'Bearer <token>' },
        body: { refresh_token: 'string (opcional)' }
      },
      getMe: {
        method: 'GET',
        url: '/api/users/me',
        headers: { Authorization: 'Bearer <token>' }
      },
      updateMe: {
        method: 'PATCH',
        url: '/api/users/me',
        headers: { Authorization: 'Bearer <token>' },
        body: { name: 'string (opcional)', renda_mensal: 'number (opcional)' }
      }
    }
  });
});

// ==================== 404 - ROTA NÃO ENCONTRADA ====================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'route_not_found',
    message: `Rota ${req.method} ${req.url} não encontrada`
  });
});

// ==================== MIDDLEWARE DE ERRO GLOBAL ====================

app.use((err, req, res, next) => {
  console.error('Erro não tratado:', err);
  
  res.status(500).json({
    success: false,
    error: 'internal_server_error',
    message: 'Ocorreu um erro interno no servidor'
  });
});

// ==================== CONEXÃO COM MONGODB ====================

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/user-auth';

mongoose.connect(MONGODB_URI)
  .then(() => console.log('✅ Conectado ao MongoDB com sucesso!'))
  .catch((error) => console.error('❌ Erro ao conectar ao MongoDB:', error.message));

// ==================== INICIAR SERVIDOR ====================

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`\n🚀 Servidor rodando em http://localhost:${PORT}`);
  console.log(`\n📝 Endpoints disponíveis:\n`);
  console.log(`🔓 PÚBLICOS:`);
  console.log(`   POST   http://localhost:${PORT}/api/register  - Criar conta`);
  console.log(`   POST   http://localhost:${PORT}/api/login     - Fazer login`);
  console.log(`   POST   http://localhost:${PORT}/api/refresh   - Atualizar token`);
  console.log(`\n🔒 PROTEGIDOS (requerem Bearer token):`);
  console.log(`   POST   http://localhost:${PORT}/api/logout    - Sair da conta`);
  console.log(`   GET    http://localhost:${PORT}/api/users/me  - Ver meu perfil`);
  console.log(`   PATCH  http://localhost:${PORT}/api/users/me  - Atualizar perfil`);
  console.log(`\n📖 Exemplo de uso:\n`);
  console.log(`   # Login`);
  console.log(`   curl -X POST http://localhost:${PORT}/api/login \\`);
  console.log(`     -H "Content-Type: application/json" \\`);
  console.log(`     -d '{"email":"usuario@email.com","password":"senha123"}'`);
  console.log(`\n   # Acessar rota protegida`);
  console.log(`   curl -X GET http://localhost:${PORT}/api/users/me \\`);
  console.log(`     -H "Authorization: Bearer SEU_TOKEN_AQUI"`);
});

module.exports = app;