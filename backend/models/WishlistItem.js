const mongoose = require('mongoose');
const WishlistPriority = require('../constants/wishlistPriority');

const wishlistItemSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'O userId é obrigatório'],
      index: true,
    },
    name: {
      type: String,
      required: [true, 'O nome do item é obrigatório'],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, 'O preço é obrigatório'],
      min: [0.01, 'O preço deve ser maior que zero'],
    },
    category: {
      type: String,
      required: [true, 'A categoria é obrigatória'],
      trim: true,
      enum: [
        'Eletrônicos', 'Moda', 'Casa', 'Beleza',
        'Alimentos', 'Esportes', 'Livros', 'Jogos', 'Viagem', 'Outros',
      ],
    },
    priority: {
      type: Number,
      required: [true, 'A prioridade é obrigatória'],
      enum: WishlistPriority.values,
    },
    // SCRUM-82: status inclui "Guardado para depois"
    status: {
      type: String,
      enum: ['Quero', 'Guardado para depois', 'Comprado'],
      default: 'Quero',
    },
    link:  { type: String, trim: true, default: '' },
    notes: { type: String, trim: true, default: '' },
  },
  {
    timestamps: true,
    collection: 'wishlist',
  }
);

module.exports = mongoose.model('WishlistItem', wishlistItemSchema);
