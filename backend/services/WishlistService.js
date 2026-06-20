// services/WishlistService.js — SCRUM-76, 78, 81, 82, 83, 84
const WishlistRepository = require('../repositories/WishlistRepository');

// Helper para criar erros com status HTTP semântico
const httpError = (message, status) => {
  const err = new Error(message);
  err.status = status;
  return err;
};

// SCRUM-84: verifica existência e ownership, retornando 404 ou 403 adequadamente
async function assertOwnership(id, userId) {
  const item = await WishlistRepository.findById(id);
  if (!item) throw httpError('Item não encontrado', 404);
  if (String(item.userId) !== String(userId)) {
    throw httpError('Acesso negado: este item pertence a outro usuário', 403);
  }
  return item;
}

class WishlistService {
  // SCRUM-76 + 77 + 78: lista itens do usuário com filtros e ordenação
  async getAll(userId, filters = {}) {
    return await WishlistRepository.findAllByUser(userId, filters);
  }

  // SCRUM-78 + 84: busca item garantindo ownership
  async getById(id, userId) {
    return await assertOwnership(id, userId);
  }

  async create({ name, price, category, priority, link, notes, userId }) {
    return await WishlistRepository.create({
      userId, name, price, category, priority,
      status: 'Quero',
      link:  link  || '',
      notes: notes || '',
    });
  }

  // SCRUM-81: edição parcial (name, price, category, priority, link, notes)
  async patch(id, userId, data) {
    await assertOwnership(id, userId);

    // Campos permitidos para edição
    const allowed = ['name', 'price', 'category', 'priority', 'link', 'notes'];
    const update = {};
    for (const key of allowed) {
      if (data[key] !== undefined) update[key] = data[key];
    }

    if (Object.keys(update).length === 0) {
      throw httpError('Nenhum campo válido para atualizar', 400);
    }

    const item = await WishlistRepository.patchByIdAndUser(id, userId, update);
    if (!item) throw httpError('Item não encontrado', 404);
    return item;
  }

  // SCRUM-82: atualização de status ("Quero", "Guardado para depois", "Comprado")
  async updateStatus(id, userId, status) {
    const allowed = ['Quero', 'Guardado para depois', 'Comprado'];
    if (!allowed.includes(status)) {
      throw httpError(`Status inválido. Use: ${allowed.join(', ')}`, 400);
    }

    await assertOwnership(id, userId);

    const item = await WishlistRepository.updateStatusByIdAndUser(id, userId, status);
    if (!item) throw httpError('Item não encontrado', 404);
    return item;
  }

  // SCRUM-83: exclusão com verificação de ownership
  async delete(id, userId) {
    await assertOwnership(id, userId);
    const item = await WishlistRepository.deleteByIdAndUser(id, userId);
    if (!item) throw httpError('Item não encontrado', 404);
    return true;
  }
}

module.exports = new WishlistService();
