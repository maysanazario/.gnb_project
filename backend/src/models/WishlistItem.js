const mongoose = require('mongoose')
const WishlistPriority = require('../constants/wishlistPriority')

const wishlistItemSchema = new mongoose.Schema(
  {
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
        'Eletrônicos',
        'Moda',
        'Casa',
        'Beleza',
        'Alimentos',
        'Esportes',
        'Livros',
        'Jogos',
        'Viagem',
        'Outros',
      ],
    },
    priority: {
      type: Number,
      required: [true, 'A prioridade é obrigatória'],
      enum: WishlistPriority.values,
    },
    status: {
      type: String,
      enum: ['Quero', 'Comprado'],
      default: 'Quero',
    },
    link: {
      type: String,
      trim: true,
      default: '',
    },
    notes: {
      type: String,
      trim: true,
      default: '',
    },
    // Futuro: adicionar userId para separar WishLists por usuário
    // userId: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: 'User',
    //   required: true,
    // },
  },
  {
    timestamps: true,
    collection: 'wishlist',
  }
)

module.exports = mongoose.model('WishlistItem', wishlistItemSchema)
