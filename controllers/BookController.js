const Book = require('../models/bookModel')
const BookController = () => {
  /**
     * Adds book to shelf
     * @req
     * @param res
     * @returns {Promise<*|Promise<any>>}
     */
  const addBook = async (req, res) => {
    const {volumeID, shelf} = req.body
    const token = req.token
    try {
      let bookToAdd = await Book().addBook({volumeID, token, shelf})
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
  const deleteBook = async (req, res) => {
    const {volumeID} = req.body
    const token = req.token
    try {
      let didDelete = Book().deleteBook({volumeID, token})
      if (didDelete) {
        return res.status(200).json({success: 'Book deleted.'})
      }
    } catch (error) {
      return res.status(500).json({error: 'Internal Error!'})
    }
  }
  // TODO:: Generate documentation
  const getBookShelf = async (req, res) => {
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
  const moveBookToShelf = async (req, res) => {
    const {volumeID, shelf} = req.body
    const token = req.token
    try {
      let moveBook = await Book().moveBookToShelf({shelf, token, volumeID})
      if (moveBook) {
        return res.status(200).json({success: 'Book moved.'})
      }
    } catch (error) {
      return res.status(500).json({error: 'Internal Error!'})
    }
  }
  return {addBook, deleteBook, getBookShelf, moveBookToShelf}
}

module.exports = BookController
