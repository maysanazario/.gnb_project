const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'sua_chave_secreta_aqui';

// Valida campos do registro
const validateRegistration = (req, res, next) => {
  const { name, email, password } = req.body;
  const errors = [];

  if (!name) {
    errors.push('Nome é obrigatório');
  } else if (name.length < 3) {
    errors.push('Nome deve ter no mínimo 3 caracteres');
  }

  if (!email) {
    errors.push('Email é obrigatório');
  } else {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailRegex.test(email)) {
      errors.push('Email inválido');
    }
  }

  if (!password) {
    errors.push('Senha é obrigatória');
  } else if (password.length < 8) {
    errors.push('Senha deve ter no mínimo 8 caracteres');
  }

  if (errors.length > 0) {
    return res.status(400).json({ success: false, errors });
  }

  next();
};

// Protege rotas privadas — lê token gerado no login
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      error: 'unauthorized',
      message: 'Token não fornecido'
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.user_id; // user_id conforme SCRUM-43
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: 'invalid_token',
      message: 'Token inválido ou expirado'
    });
  }
};

module.exports = { validateRegistration, authMiddleware };