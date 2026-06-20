// controllers/AuthController.js
const AuthService = require('../services/AuthService');

class AuthController {
  async login(req, res) {
    try {
      const { email, password } = req.body;

      // Validação básica
      if (!email || !password) {
        return res.status(400).json({
          success: false,
          error: 'validation_error',
          message: 'Email e senha são obrigatórios'
        });
      }

      const result = await AuthService.login({ email, password });

      return res.status(200).json({
        success: true,
        message: 'Login realizado com sucesso',
        data: result
      });
    } catch (error) {
      if (error.message === 'Email ou senha inválidos') {
        return res.status(401).json({
          success: false,
          error: 'invalid_credentials',
          message: error.message
        });
      }

      return res.status(500).json({
        success: false,
        error: 'internal_error',
        message: error?.message || 'Erro interno ao fazer login'
      });
    }
  }

  async refreshToken(req, res) {
    try {
      const { refresh_token } = req.body;

      if (!refresh_token) {
        return res.status(400).json({
          success: false,
          error: 'missing_refresh_token',
          message: 'Refresh token é obrigatório'
        });
      }

      const result = await AuthService.refreshToken(refresh_token);

      return res.status(200).json({
        success: true,
        message: 'Token atualizado com sucesso',
        data: result
      });
    } catch (error) {
      return res.status(401).json({
        success: false,
        error: 'invalid_refresh_token',
        message: error.message
      });
    }
  }

  async logout(req, res) {
    try {
      const { refresh_token } = req.body;

      if (refresh_token) {
        await AuthService.logout(refresh_token);
      }

      return res.status(200).json({
        success: true,
        message: 'Logout realizado com sucesso'
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: 'internal_error',
        message: error?.message || 'Erro ao fazer logout'
      });
    }
  }
}

module.exports = new AuthController();