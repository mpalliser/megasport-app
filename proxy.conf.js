const fs = require('fs');

const mockUser = false

const PROXY_CONFIG = {
  '/events': {
    target: 'http://localhost:8080',
    secure: false,
  },
}
module.exports = PROXY_CONFIG
