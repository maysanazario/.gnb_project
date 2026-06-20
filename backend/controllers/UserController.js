const UserService = require('../services/UserService');

class UserController {
  async register(req, res) {
    try {
      const { name, email, password } = req.body;
      const result = await UserService.register({ name, email, password });

      return res.status(201).json({
        success: true,
        message: 'Usuário cadastrado com sucesso',
        data: result
      });
    } catch (error) {
      if (error.message.includes('Email já cadastrado')) {
        return res.status(409).json({
          success: false,
          error: 'email_duplicate',
          message: error.message
        });
      }
      return res.status(500).json({
        success: false,
        error: 'internal_error',
        message: error?.message || 'Erro interno'
      });
    }
  }

  // SCRUM-47: GET /users/me
  async getMe(req, res) {
    try {
      const user = await UserService.getMe(req.userId);
      return res.status(200).json({
        success: true,
        data: user
      });
    } catch (error) {
      return res.status(404).json({
        success: false,
        error: 'not_found',
        message: error.message
      });
    }
  }

  // SCRUM-48: PATCH /users/me
  async updateMe(req, res) {
    try {
      const { renda_mensal, name } = req.body;
      const user = await UserService.updateMe(req.userId, { renda_mensal, name });

      return res.status(200).json({
        success: true,
        message: 'Perfil atualizado com sucesso',
        data: user
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        error: 'validation_error',
        message: error.message
      });
    }
  }
}

module.exports = new UserController();