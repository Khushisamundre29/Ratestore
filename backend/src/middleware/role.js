// pass in the allowed roles like checkRole('admin') or checkRole('admin', 'user')
function checkRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: 'you are not allowed to access this' });
    }
    next();
  };
}

module.exports = checkRole;