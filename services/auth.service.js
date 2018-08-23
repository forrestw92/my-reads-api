const jwt = require('jsonwebtoken')
const {secret} = require('../config')

export default class authService {
  /**
     * Issues a json web token
     * Never expires
     * @param payload
     * @returns {*}
     */
  static issue (payload) { return jwt.sign(payload, secret) }
}
