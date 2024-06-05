const jwt = require('jsonwebtoken');

const verifyToken = async (req, res, next) => {
  const token = req.headers['authorization'].split(' ')[1];
  if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });

  try {
    const payload = jwt.verify(token, process.env.JWT_KEY);

    const currentTimestamp = Math.floor(Date.now() / 1000);

    if (payload.exp < currentTimestamp) {
      return res.status(401).send('Token expired');
    }

    req.user = payload; // Attach user data to request
    next();
  } catch (error) {
    return res.status(401).send('Invalid token');
  }
}


// Example protected route
module.exports = { verifyToken }