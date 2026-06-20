// middleware/AuthMiddleware.js
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'sua_chave_secreta_aqui';

class AuthMiddleware {
  authenticate(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        success: false,
        error: 'no_token',
        message: 'Token de acesso não fornecido'
      });
    }

    // Suporta formato "Bearer TOKEN"
    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      return res.status(401).json({
        success: false,
        error: 'invalid_token_format',
        message: 'Formato do token inválido. Use: Bearer <token>'
      });
    }

    const token = parts[1];

    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      
      // Adiciona o user_id ao request (alinhado com UserService)
      req.userId = decoded.user_id;
      req.userEmail = decoded.email;
      
      return next();
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({
          success: false,
          error: 'token_expired',
          message: 'Token expirado'
        });
      }

      if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({
          success: false,
          error: 'invalid_token',
          message: 'Token inválido'
        });
      }

      return res.status(401).json({
        success: false,
        error: 'unauthorized',
        message: 'Não autorizado'
      });
    }
  }

  optionalAuth(req, res, next) {
    const authHeader = req.headers.authorization;

    if (authHeader) {
      const parts = authHeader.split(' ');
      if (parts.length === 2 && parts[0] === 'Bearer') {
        try {
          const decoded = jwt.verify(parts[1], JWT_SECRET);
          req.userId = decoded.user_id;
          req.userEmail = decoded.email;
        } catch (error) {
          // Token inválido, mas continua sem autenticação
        }
      }
    }
    
    return next();
  }
}

module.exports = new AuthMiddleware();