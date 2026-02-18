const { rateLimit, ipKeyGenerator } = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 10, // limit each IP to 10 requests per windowMs
  message: 'Too many requests from this IP, please try again after 15 minutes',
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})

const aiLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // Only 5 AI generations per hour per user
  message: 'AI generation limit reached for this hour. Please wait to save tokens.',
  keyGenerator: (req) => req.user ? req.user.id : ipKeyGenerator(req.ip), // Use user ID if available, otherwise fallback to IP
})

module.exports = { limiter, aiLimiter };