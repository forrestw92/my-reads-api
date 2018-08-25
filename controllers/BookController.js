const Book = require('../models/BookModel')
const books = require('google-books-search')
const {defaultOptions} = require('../config/')
class BookController {
  /**
     * Adds book to shelf
     * @req
     * @param res
     * @returns {Promise<*|Promise<any>>}
     */
  async addBook (req, res) {
    const {volumeID, shelf} = req.body
    const token = req.token
    let bookDetails = ''
    books.lookup(volumeID, defaultOptions.key, function (error, result) {
      if (error) {
        return res.status(400).json({error})
      }
      bookDetails = result
    })
    try {
      let bookToAdd = await Book.addBook({volumeID: bookDetails.volumeID, token, shelf})
      if (bookToAdd) {
        return res.status(200).json({success: 'Book Added.'})
      }
    } catch (error) {
      return res.status(500).json({error: 'Internal Error!'})
    }
  }
  /**
     * Deletes book
     * @param req
     * @param res
     * @returns {Promise<*|Promise<any>>}
     */
  async deleteBook (req, res) {
    const {volumeID} = req.body
    const token = req.token
    try {
      let didDelete = Book.deleteBook({volumeID, token})
      if (didDelete) {
        return res.status(200).json({success: 'Book deleted.'})
      }
    } catch (error) {
      return res.status(500).json({error: 'Internal Error!'})
    }
  }
  // TODO:: Generate documentation
  async getBookShelf (req, res) {
    const {shelf} = req.body
    const token = req.token

    try {

    } catch (error) {
      return res.status(500).json({error: 'Internal Error!'})
    }
  }
  /**
     * Moves book from shelf to another
     * @param req
     * @param res
     * @returns {Promise<*|Promise<any>>}
     */
  async moveBookToShelf (req, res) {
    const {volumeID, shelf} = req.body
    const token = req.token
    try {
      let moveBook = await Book.moveBookToShelf({shelf, token, volumeID})
      if (moveBook) {
        return res.status(200).json({success: 'Book moved.'})
      }
    } catch (error) {
      return res.status(500).json({error: 'Internal Error!'})
    }
  }
}

module.exports = BookController
