// services/UserService.js
const jwt = require('jsonwebtoken'); // CORRIGIDO: import ausente na versão anterior
const User = require('../models/User');

class UserService {
  async register({ name, email, password }) {
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) throw new Error('Email já cadastrado');

    const user = new User({ name, email, password });
    await user.save();

    const token = jwt.sign(
      { user_id: user._id, email: user.email },
      process.env.JWT_SECRET || 'sua_chave_secreta_aqui',
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    const refreshToken = jwt.sign(
      { user_id: user._id },
      process.env.JWT_REFRESH_SECRET || 'sua_chave_refresh_aqui',
      { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d' }
    );

    // TODO: adicionar refreshToken ao Set do AuthService

    return {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        renda_mensal: user.renda_mensal,
        onboarding_completo: user.onboarding_completo,
        createdAt: user.createdAt,
      },
      token,
      refresh_token: refreshToken,
    };
  }

  async getMe(userId) {
    const user = await User.findById(userId).select('-password');
    if (!user) throw new Error('Usuário não encontrado');
    return user;
  }

  async updateMe(userId, { renda_mensal, name }) {
    if (renda_mensal !== undefined) {
      if (typeof renda_mensal !== 'number' || renda_mensal <= 0) {
        throw new Error('Renda mensal deve ser um valor numérico positivo');
      }
    }

    const updateData = {};
    if (name) updateData.name = name;
    if (renda_mensal !== undefined) {
      updateData.renda_mensal = renda_mensal;
      updateData.onboarding_completo = true;
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) throw new Error('Usuário não encontrado');
    return user;
  }
}

module.exports = new UserService();
