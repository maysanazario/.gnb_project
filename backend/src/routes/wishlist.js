const express = require('express')
const WishlistItem = require('../models/WishlistItem')

const router = express.Router()

// Lista todos os itens do wishlist
router.get('/', async (req, res) => {
  try {
    const items = await WishlistItem.find().sort({ createdAt: -1 })
    res.json(items)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Erro ao buscar itens do wishlist' })
  }
})

// Busca um item pelo ID
router.get('/:id', async (req, res) => {
  try {
    const item = await WishlistItem.findById(req.params.id)
    if (!item) {
      return res.status(404).json({ error: 'Item não encontrado' })
    }
    res.json(item)
  } catch (error) {
    console.error(error)
    res.status(400).json({ error: 'ID inválido ou item não encontrado' })
  }
})

// Cria um novo item no wishlist
router.post('/', async (req, res) => {
  try {
    const { name, price, category, priority, link, notes } = req.body
    const item = new WishlistItem({
      name,
      price,
      category,
      priority,
      status: 'Quero',
      link: link || '',
      notes: notes || '',
    })

    const savedItem = await item.save()
    res.status(201).json(savedItem)
  } catch (error) {
    console.error(error)
    res.status(400).json({ error: 'Erro ao criar item do wishlist', details: error.message })
  }
})

// Atualiza um item existente
router.put('/:id', async (req, res) => {
  try {
    const updates = req.body
    const item = await WishlistItem.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
      context: 'query',
    })

    if (!item) {
      return res.status(404).json({ error: 'Item não encontrado' })
    }

    res.json(item)
  } catch (error) {
    console.error(error)
    res.status(400).json({ error: 'Erro ao atualizar item', details: error.message })
  }
})

// Remove um item do wishlist
router.delete('/:id', async (req, res) => {
  try {
    const item = await WishlistItem.findByIdAndDelete(req.params.id)
    if (!item) {
      return res.status(404).json({ error: 'Item não encontrado' })
    }

    res.json({ message: 'Item excluído com sucesso' })
  } catch (error) {
    console.error(error)
    res.status(400).json({ error: 'Erro ao excluir item', details: error.message })
  }
})

module.exports = router
