const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 50, // limit each IP to 50 requests per windows
    message: 'Too many requests from this IP Address, please try again later'
});

module.exports = limiter;