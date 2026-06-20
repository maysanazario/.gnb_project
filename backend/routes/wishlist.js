// routes/wishlist.js — SCRUM-76, 81, 82, 83
const express = require('express');
const WishlistController = require('../controllers/WishlistController');
const AuthMiddleware = require('../middlewares/AuthMiddleware');

const router = express.Router();

// Todas as rotas exigem autenticação — req.userId injetado pelo middleware
router.use(AuthMiddleware.authenticate);

// SCRUM-76: listar com filtros (?category=&priority=&status=)
router.get('/',              (req, res) => WishlistController.getAll(req, res));

// Buscar item por id
router.get('/:id',           (req, res) => WishlistController.getById(req, res));

// Criar item
router.post('/',             (req, res) => WishlistController.create(req, res));

// SCRUM-81: edição parcial (name, price, category, priority, link, notes)
router.patch('/:id',         (req, res) => WishlistController.patch(req, res));

// SCRUM-82: atualizar só o status ("Quero" | "Guardado para depois" | "Comprado")
router.patch('/:id/status',  (req, res) => WishlistController.updateStatus(req, res));

// SCRUM-83: excluir item (só o dono)
router.delete('/:id',        (req, res) => WishlistController.delete(req, res));

module.exports = router;
