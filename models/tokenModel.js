const { query, execute} = require('../config/database')

class tokenModel {
  /**
     * Adds token to table for authorization
     * @param token
     * @returns {Promise<T | never>}
     */
  static async addToken (token) {
    return execute('INSERT INTO tokens SET token=?', token)
      .then(results => {
        return results
      })
  }

  /**
     * Checks if token is valid in table
     * @param token
     * @returns {Promise<boolean | never>}
     */
  static async validateToken (token) {
    return query('SELECT * FROM tokens WHERE token=?', token)
      .then(rows => {
        return rows.length === 1
      }).catch((error) => {
        return error
      })
  }
}

module.exports = tokenModel
