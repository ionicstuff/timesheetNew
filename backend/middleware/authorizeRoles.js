const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.roleMaster) {
      return res
        .status(403)
        .json({ message: "Access denied. User role not available." });
    }

    const userRole = req.user.roleMaster.roleName;
    const allowedRolesLowerCase = allowedRoles.map((role) =>
      role.toLowerCase(),
    );

    if (!allowedRolesLowerCase.includes(userRole.toLowerCase())) {
      return res.status(403).json({
        message: `Access denied. Role '${userRole}' is not authorized.`,
      });
    }

    next();
  };
};

module.exports = authorizeRoles;
