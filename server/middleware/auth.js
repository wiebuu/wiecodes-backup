export const authenticate = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }
  next();
};

export const isAdmin = (req, res, next) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Forbidden: Admins only' });
  }
  next();
};

export const isAdminOrReviewer = (req, res, next) => {
  const role = req.user?.role;
  if (role === 'admin' || role === 'reviewer') {
    next();
  } else {
    return res.status(403).json({ success: false, message: 'Only reviewers or admins can rate templates' });
  }
};
