const { query, execute } = require('../config/database')

class BookModel {
  /**
     * Add new book to user list
     * @param details - volumeID,token,shelf,status
     * @returns {Promise<T | never>}
     */
  static async addBook (details) {
    return execute('INSERT INTO my_books SET ?', details)
      .then(results => {
        return results[0].affectedRows === 1
      }).catch((error) => {
        return error
      })
  }
  /**
     * Deletes book from user list
     * @param details - volumeID and token
     * @returns {Promise<boolean | never>}
     */
  static async deleteBook (details) {
    return execute('DELETE FROM my_books WHERE volumeID = ? and token=?', details)
      .then(result => {
        return result[0].affectedRows === 1
      }).catch((error) => {
        return error
      })
  }

  // todo:: Generate jsDoc
  static async getBook (volumeID) {
  }
  /**
     * Moves book to new shelf
     * @param details - shelf,token,volumeID
     * @returns {Promise<boolean | never>}
     */
  static async moveBookToShelf (details) {
    return execute('UPDATE FROM my_books SET shelf=? WHERE token=? AND volumeID=?', details)
      .then(result => {
        return result[0].affectedRows === 1
      }).catch((error) => {
        return error
      })
  }
}

module.exports = BookModel
