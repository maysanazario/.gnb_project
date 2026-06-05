// services/AuthService.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'sua_chave_secreta_aqui';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'sua_chave_refresh_aqui';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '30d';

// Armazenamento simples para refresh tokens (em produção use Redis ou banco de dados)
const refreshTokens = new Set();

class AuthService {
  async login({ email, password }) {
    // Buscar usuário pelo email
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      throw new Error('Email ou senha inválidos');
    }

    // Verificar senha
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      throw new Error('Email ou senha inválidos');
    }

    // Gerar token de acesso
    const token = jwt.sign(
      { user_id: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    // Gerar refresh token
    const refreshToken = jwt.sign(
      { user_id: user._id },
      JWT_REFRESH_SECRET,
      { expiresIn: JWT_REFRESH_EXPIRES_IN }
    );

    // Armazenar refresh token
    refreshTokens.add(refreshToken);

    return {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        renda_mensal: user.renda_mensal,
        onboarding_completo: user.onboarding_completo,
        createdAt: user.createdAt
      },
      token,
      refresh_token: refreshToken
    };
  }

  async refreshToken(oldRefreshToken) {
    // Verificar se o refresh token existe no armazenamento
    if (!refreshTokens.has(oldRefreshToken)) {
      throw new Error('Refresh token inválido');
    }

    try {
      // Verificar e decodificar o refresh token
      const decoded = jwt.verify(oldRefreshToken, JWT_REFRESH_SECRET);
      
      // Buscar usuário
      const user = await User.findById(decoded.user_id);
      if (!user) {
        throw new Error('Usuário não encontrado');
      }

      // Remover o token antigo
      refreshTokens.delete(oldRefreshToken);

      // Gerar novos tokens
      const newToken = jwt.sign(
        { user_id: user._id, email: user.email },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
      );

      const newRefreshToken = jwt.sign(
        { user_id: user._id },
        JWT_REFRESH_SECRET,
        { expiresIn: JWT_REFRESH_EXPIRES_IN }
      );

      refreshTokens.add(newRefreshToken);

      return {
        token: newToken,
        refresh_token: newRefreshToken
      };
    } catch (error) {
      throw new Error('Refresh token expirado ou inválido');
    }
  }

  async logout(refreshToken) {
    refreshTokens.delete(refreshToken);
    return true;
  }
}

module.exports = new AuthService();