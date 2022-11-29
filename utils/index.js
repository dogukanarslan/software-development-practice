const jwt = require('jsonwebtoken');

const decodeToken = (token) => jwt.verify(token, 'secret');

module.exports.decodeToken = decodeToken;
