export const protectRoute = async (req, res, next) => {
  try {
    if (!req.auth()?.isAuthenticated) {
      return res.status(401).json({ message: "Unauthorized - you must be logged in" });
    }
  } catch (error) {
    console.error('Authentication check failed:', error);
  } return res.status(401).json({ message: "Unauthorized - you must be logged in" });

  next();
};