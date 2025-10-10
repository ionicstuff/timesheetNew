const jwt = require('jsonwebtoken');
const { User, RoleMaster } = require('../models');

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({
        message: 'No token provided, authorization denied',
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.id, {
      include: [{ model: RoleMaster, as: 'roleMaster' }],
    });

    if (!user) {
      return res.status(401).json({
        message: 'Token is not valid',
      });
    }

    if (!user.isActive) {
      return res.status(401).json({
        message: 'User account is inactive',
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({
      message: 'Token is not valid',
    });
  }
};

const roleMiddleware = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        message: 'Unauthorized',
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: 'Insufficient permissions',
      });
    }

    next();
  };
};

module.exports = {
  authMiddleware,
  roleMiddleware,
};
