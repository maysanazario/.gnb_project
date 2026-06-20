const WishlistItem = require('../models/WishlistItem');

class WishlistRepository {
  // SCRUM-76: lista com filtros + ordenação por prioridade DESC
  async findAllByUser(userId, filters = {}) {
    const query = { userId };

    if (filters.category) query.category = filters.category;
    if (filters.priority) query.priority = Number(filters.priority);
    if (filters.status)   query.status   = filters.status;

    return await WishlistItem
      .find(query)
      .sort({ priority: -1, createdAt: -1 }) // SCRUM-77: maior prioridade primeiro
      .select('name price category priority status link notes createdAt'); // SCRUM-79
  }

  // Busca sem filtro de usuário — para checar se item existe antes de verificar ownership
  async findById(id) {
    return await WishlistItem.findById(id);
  }

  // Busca garantindo que o item pertence ao usuário — SCRUM-78
  async findByIdAndUser(id, userId) {
    return await WishlistItem.findOne({ _id: id, userId });
  }

  async create(data) {
    const item = new WishlistItem(data);
    return await item.save();
  }

  // SCRUM-81: PATCH parcial — só atualiza os campos enviados
  async patchByIdAndUser(id, userId, data) {
    return await WishlistItem.findOneAndUpdate(
      { _id: id, userId },
      { $set: data },
      { new: true, runValidators: true, context: 'query' }
    );
  }

  // SCRUM-82: atualiza apenas o status
  async updateStatusByIdAndUser(id, userId, status) {
    return await WishlistItem.findOneAndUpdate(
      { _id: id, userId },
      { $set: { status } },
      { new: true, runValidators: true }
    );
  }

  // SCRUM-83: exclusão garantindo ownership
  async deleteByIdAndUser(id, userId) {
    return await WishlistItem.findOneAndDelete({ _id: id, userId });
  }
}

module.exports = new WishlistRepository();
