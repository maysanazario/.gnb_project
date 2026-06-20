// controllers/WishlistController.js
const WishlistService = require('../services/WishlistService');

// Responde com o status HTTP correto baseado no erro do service
function handleError(res, error) {
  const status = error.status || 500;
  return res.status(status).json({
    success: false,
    error: status === 403 ? 'forbidden'
         : status === 404 ? 'not_found'
         : status === 400 ? 'validation_error'
         : 'internal_error',
    message: error.message || 'Erro interno no servidor',
  });
}

class WishlistController {
  // SCRUM-76: GET /wishlist?category=&priority=&status=
  async getAll(req, res) {
    try {
      const { category, priority, status } = req.query;
      const items = await WishlistService.getAll(req.userId, { category, priority, status });
      return res.status(200).json({ success: true, data: items });
    } catch (error) {
      return handleError(res, error);
    }
  }

  async getById(req, res) {
    try {
      const item = await WishlistService.getById(req.params.id, req.userId);
      return res.status(200).json({ success: true, data: item });
    } catch (error) {
      return handleError(res, error);
    }
  }

  async create(req, res) {
    try {
      const item = await WishlistService.create({ ...req.body, userId: req.userId });
      return res.status(201).json({
        success: true, message: 'Item criado com sucesso', data: item,
      });
    } catch (error) {
      return handleError(res, error);
    }
  }

  // SCRUM-81: PATCH /wishlist/:id — edição parcial
  async patch(req, res) {
    try {
      const item = await WishlistService.patch(req.params.id, req.userId, req.body);
      return res.status(200).json({
        success: true, message: 'Item atualizado com sucesso', data: item,
      });
    } catch (error) {
      return handleError(res, error);
    }
  }

  // SCRUM-82: PATCH /wishlist/:id/status — atualização de status
  async updateStatus(req, res) {
    try {
      const { status } = req.body;
      if (!status) {
        return res.status(400).json({
          success: false, error: 'validation_error', message: 'O campo status é obrigatório',
        });
      }
      const item = await WishlistService.updateStatus(req.params.id, req.userId, status);
      return res.status(200).json({
        success: true, message: 'Status atualizado com sucesso', data: item,
      });
    } catch (error) {
      return handleError(res, error);
    }
  }

  // SCRUM-83: DELETE /wishlist/:id
  async delete(req, res) {
    try {
      await WishlistService.delete(req.params.id, req.userId);
      return res.status(200).json({ success: true, message: 'Item excluído com sucesso' });
    } catch (error) {
      return handleError(res, error);
    }
  }
}

module.exports = new WishlistController();
