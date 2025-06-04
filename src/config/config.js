require('dotenv').config();
module.exports = {
  port: process.env.PORT || 3000,
  apiKey: process.env.API_KEY || 'secret-key'
};