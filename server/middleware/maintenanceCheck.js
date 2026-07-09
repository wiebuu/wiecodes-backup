import Settings from '../models/Settings.js';

let cachedSettings = null;
let lastFetched = 0;
const CACHE_DURATION = 60 * 1000; // 60 seconds

const maintenanceCheck = async (req, res, next) => {
  try {
    const isAdmin = req.user?.isAdmin;
    const isAdminRoute = req.originalUrl.includes('/admin');

    const now = Date.now();
    if (!cachedSettings || now - lastFetched > CACHE_DURATION) {
      cachedSettings = await Settings.findOne();
      lastFetched = now;
    }

    if (!cachedSettings) {
      console.warn('⚠️ No settings found. Assuming maintenanceMode = false.');
      return next();
    }

    // 🔐 Maintenance active — block non-admins and non-admin routes
    if (cachedSettings.maintenanceMode && !isAdmin && !isAdminRoute) {
      return res.status(503).json({ message: '🚧 Site is under maintenance.' });
    }

    next();
  } catch (err) {
    console.error('❌ Maintenance check error:', err);
    res.status(500).json({ message: 'Server error during maintenance check' });
  }
};

export default maintenanceCheck;
