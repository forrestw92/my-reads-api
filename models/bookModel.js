const { query, execute} = require('../config/database')

const bookModel = () => {
  /**
     * Add new book to user list
     * @param details - volumeID,token,shelf,status
     * @returns {Promise<T | never>}
     */
  const addBook = async (details) => {
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
  const deleteBook = async (details) => {
    return execute('DELETE FROM my_books WHERE volumeID = ? and token=?', details)
      .then(result => {
        return result[0].affectedRows === 1
      }).catch((error) => {
        return error
      })
  }
  /**
     * Moves book to new shelf
     * @param details - shelf,token,volumeID
     * @returns {Promise<boolean | never>}
     */
  const moveBookToShelf = async (details) => {
    return execute('UPDATE FROM my_books SET shelf=? WHERE token=? AND volumeID=?', details)
      .then(result => {
        return result[0].affectedRows === 1
      }).catch((error) => {
        return error
      })
  }
  return {
    addBook,
    deleteBook,
    moveBookToShelf
  }
}

module.exports = bookModel
