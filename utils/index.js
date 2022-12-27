const jwt = require('jsonwebtoken');

const decodeToken = (token) => jwt.verify(token, process.env.SECRET_KEY);

module.exports.decodeToken = decodeToken;
