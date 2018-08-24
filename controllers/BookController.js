const Book = require('../models/bookModel')
const BookController = () => {
  const addBook = async (req, res) => {
    const {volumeID, token, shelf} = req.body
    try {
      let bookToAdd = await Book().addBook({volumeID, token, shelf})
      if (bookToAdd) {
        return res.status(200).json({success: 'Book Added.'})
      }
    } catch (error) {
      return res.status(500).json({error: 'Internal Error!'})
    }
  }
  const deleteBook = async (req, res) => {
    const {volumeID, token} = req.body

    try {
      let didDelete = Book().deleteBook({volumeID, token})
      if (didDelete) {
        return res.status(200).json({success: 'Book deleted.'})
      }
    } catch (error) {
      return res.status(500).json({error: 'Internal Error!'})
    }
  }
  const getBookShelf = async (req, res) => {
    const {token, shelf} = req.body

    try {

    } catch (error) {
      return res.status(500).json({error: 'Internal Error!'})
    }
  }
  const moveBookToShelf = async (req, res) => {
    const {volumeID, shelf, token} = req.body
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
