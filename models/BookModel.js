const { query, execute } = require('../config/database')

class BookModel {
  /**
     * Get volumeID's of books
     * @param {String} token
     * @param {Array} volumeIDs
     * @returns {Promise<T | never>}
     */
  static async getUserBooksByVolumeIDS (token, volumeIDs) {
    let more = ''
    for (let i = 1; i <= volumeIDs.length - 1; i++) {
      more += ' or volumeID = ? '
    }
    return query('SELECT volumeID from my_books WHERE token = ? AND volumeID=? ' + more, token, ...volumeIDs)
      .then(rows => {
        return rows
      })
  }
  /**
     * Add book details to table
     * @param {Object} details
     * @returns {Promise<boolean | never>}
     */
  static async addBook (details) {
    return execute('INSERT INTO books SET ?', details)
      .then(results => {
        return results[0].affectedRows === 1
      })
  }

  /**
     * Deletes book from user list
     * @param {String} volumeID
     * @param {Token} token
     * @returns {Promise<boolean | never>}
     */
  static async deleteBook (volumeID, token) {
    return execute('DELETE FROM my_books WHERE volumeID = ? and token=?', volumeID, token)
      .then(result => {
        return result[0].affectedRows === 1
      })
  }

  /**
     * Add book identifiers(isbn's)
     * @param {String} volumeID
     * @param {Array} identifiers
     * @returns {Promise<[any , any , any , any , any , any , any , any , any , any]>}
     */
  static async addBookIdentifiers (volumeID, identifiers) {
    return Promise.all(
      identifiers.map(ident => {
        return execute('INSERT INTO identifiers SET ?', {volumeID, isbn: ident.identifier})
          .then(result => {
            return result[0].affectedRows === 1
          }).catch((error) => {
            return error
          })
      })
    )
  }

  /**
     * Checks if book is already in table.
     * @param {String} volumeID
     * @returns {Promise<boolean | never>}
     */
  static async validateBook (volumeID) {
    return query('SELECT volumeID FROM books WHERE volumeID = ?', volumeID)
      .then(rows => {
        return rows.length === 0
      })
  }

  static async userHasBook (volumeID) {
    return query('SELECT volumeID FROM my_books WHERE volumeID = ?', volumeID)
      .then(rows => {
        return rows.length === 0
      })
  }

  static async getBookShelf (shelf, token, offset) {
    return query(`
SELECT b.*, 
       m.*, 
       (SELECT r.rating 
        FROM   book_ratings r 
        WHERE  r.volumeID = b.volumeID) AS userRating 
FROM   my_books m 
       INNER JOIN books AS b 
               ON m.volumeID = b.volumeID 
WHERE  m.shelf = ? 
       AND m.token = ? 
LIMIT  10 offset ? `, shelf, token, offset)
      .then(rows => {
        rows = rows.map(row => {
          row.userRating = row.userRating || -1
          row.categories = JSON.parse(row.categories)
          row.authors = JSON.parse(row.authors)
          row.images = JSON.parse(row.images)
          row.industryIdentifiers = JSON.parse(row.industryIdentifiers)
          Object.keys(row).forEach((key) => (row[key] == null) && delete row[key])
          return row
        })
        return rows
      })
  }
  static async getBookShelfs (token) {
    return query(`
(SELECT b.*, 
        m.shelf, 
        (SELECT r.rating 
         FROM   book_ratings r 
         WHERE  r.volumeID = b.volumeID AND token=?) AS userRating 
 FROM   books b 
        INNER JOIN my_books AS m 
                ON b.volumeID = m.volumeID 
 WHERE  token =? 
        AND m.shelf = 'read' 
 ORDER  BY m.updatedAt DESC 
 LIMIT  6) 
UNION ALL 
(SELECT b.*, 
        m.shelf, 
        (SELECT r.rating 
         FROM   book_ratings r 
         WHERE  r.volumeID = b.volumeID AND token=?) AS userRating 
 FROM   books b 
        INNER JOIN my_books AS m 
                ON b.volumeID = m.volumeID 
 WHERE  token =? 
        AND m.shelf = 'currentlyReading' 
 ORDER  BY m.updatedAt DESC 
 LIMIT  6) 
UNION ALL 
(SELECT b.*, 
        m.shelf, 
        (SELECT r.rating 
         FROM   book_ratings r 
         WHERE  r.volumeID = b.volumeID AND token=?) AS userRating 
 FROM   books b 
        INNER JOIN my_books AS m 
                ON b.volumeID = m.volumeID 
 WHERE  token =? 
        AND m.shelf = 'wantToRead' 
 ORDER  BY m.updatedAt DESC 
 LIMIT  6) `, token, token, token,token, token, token)
      .then(rows => {
        rows = rows.map(row => {
          row.userRating = row.userRating || -1
          row.categories = JSON.parse(row.categories)
          row.authors = JSON.parse(row.authors)
          row.images = JSON.parse(row.images)
          row.industryIdentifiers = JSON.parse(row.industryIdentifiers)
          Object.keys(row).forEach((key) => (row[key] == null) && delete row[key])
          return row
        })
        return rows
      })
  }

  /**
     * Count all books on user shelf
     * @param {String} shelf
     * @param {String} token
     * @returns {Promise<T | never>}
     */
  static async countBooksOnShelf (shelf, token) {
    return query(`SELECT COUNT(m.volumeID) as count from my_books as m WHERE token=? AND shelf = ?`, token, shelf)
      .then(rows => {
        return rows[0].count
      })
  }

  /**
     * Count all books on user shelf
     * @param {String} shelf
     * @param {String} token
     * @returns {Promise<T | never>}
     */
  static async countAllBookShelfs (token) {
    return query(`SELECT m.shelf ,COUNT(m.volumeID) as count from my_books as m WHERE token=? GROUP BY shelf`, token)
      .then(rows => {
        return [].concat(...rows)
      })
  }
  /**
     * Add book to user shelf
     * @param {String} volumeID
     * @param {String} token
     * @param {String} shelf
     * @param {Date} created_at
     * @returns {Promise<boolean | never>}
     */
  static async addBookToShelf (volumeID, token, shelf, createdAt) {
    return execute('INSERT INTO my_books SET volumeID=?,token=?,shelf=?,createdAt=?', volumeID, token, shelf, createdAt)
      .then(result => {
        return result[0].affectedRows === 1
      })
  }
  /**
     * Adds default books when token is generated
     * @param {String} token
     * @returns {Promise<boolean | never>}
     */
  static async addBooksToShelf (token) {
    return execute(`INSERT INTO my_books ( volumeID,token,shelf,createdAt) VALUES ?`, [
      ['nggnmAEACAAJ', token, 'currentlyReading', new Date()],
      ['sJf1vQAACAAJ', token, 'currentlyReading', new Date()],
      ['evuwdDLfAyYC', token, 'wantToRead', new Date()],
      ['74XNzF_al3MC', token, 'wantToRead', new Date()],
      ['jAUODAAAQBAJ', token, 'read', new Date()],
      ['IOejDAAAQBAJ', token, 'read', new Date()],
      ['1wy49i', token, 'read', new Date()]])
      .then(result => {
        console.log(result)
        return result[0].affectedRows === 1
      }).catch(err => console.log(err))
  }
  /**
     * Moves book to new shelf
     * @param {String} shelf
     * @param {String} token
     * @param {String} volumeID
     * @returns {Promise<boolean | never>}
     */
  static async updateUserBook (shelf, token, volumeID) {
    return execute('UPDATE my_books SET shelf=? WHERE token=? AND volumeID=?', shelf, token, volumeID)
      .then(result => {
        return result[0].affectedRows === 1
      })
  }

  /**
     * Add user book rating
     * @param {String} volumeID
     * @param {Number} rating
     * @param {String} token
     * @returns {Promise<boolean | never>}
     */
  static async addUserRating (volumeID, rating, token) {
    return execute('INSERT INTO book_ratings SET volumeID=?,rating=?,token=?', volumeID, rating, token)
      .then(result => {
        return result[0].affectedRows === 1
      })
  }

  /**
     * Updates user book rating
     * @param {String} volumeID
     * @param {Number} rating
     * @param {String} token
     * @returns {Promise<boolean | never>}
     */
  static async updateUserRating (volumeID, rating, token) {
    return execute('UPDATE book_ratings SET rating=? WHERE volumeID = ? AND token =?', rating, volumeID, token)
      .then(result => {
        return result[0].affectedRows === 1
      })
  }
  /**
     * Get book rating from token
     * @param {String} volumeID
     * @param {String} token
     * @returns {Promise<T | never>}
     */
  static async getUserRating (volumeID, token) {
    return query('SELECT rating FROM book_ratings WHERE token=? and volumeID=?', token, volumeID)
      .then(rows => {
        return rows[0]
      })
  }
}

module.exports = BookModel
