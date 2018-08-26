const Book = require('../models/BookModel')
const books = require('../api')
const {defaultOptions} = require('../config/')
class BookController {
  static shelfTypes () { return ['currentlyReading', 'wantToRead', 'read'] }

  /**
     * Adds book to shelf
     * @param req
     * @param res
     * @status 400  Please Provide a valid Shelf
     * @returns {Promise<*|Promise<any>>}
     */
  async addBook (req, res) {
    let {shelf} = req.body
    const token = req.token
    if (!shelf) return res.status(400).json({error: 'INVALID_SHELF'})
    if (!BookController.shelfTypes().includes(shelf)) return res.status(400).json({error: 'INVALID_SHELF'})
    if (!req.body.volumeID) return res.status(400).json({error: 'INVALID_VOLUMEID'})
    try {
      const userHasBook = await Book.userHasBook(req.body.volumeID)
      if (!userHasBook) {
        return res.status(400).json({error: 'BOOK_EXIST'})
      }
      const isValid = await Book.validateBook(req.body.volumeID)

      if (!isValid) {
        let addBook = await Book.addBookToShelf(
          req.body.volumeID,
          token,
          shelf,
          new Date()
        )
        if (addBook) {
          return res.status(201).json({success: 'BOOK_ADDED'})
        }
      }
      let bookDetails = await books.lookup(req.body.volumeID, defaultOptions.key)
      let {volumeID, title, authors, images, subtitle, publisher, publishedDate, description, industryIdentifiers, pageCount, printType, categories, maturityRating, language, averageRating, ratingsCount, thumbnail, link} = bookDetails
      await Book.addBook({
        volumeID,
        title,
        authors: JSON.stringify(authors),
        subtitle,
        publisher,
        industryIdentifiers: JSON.stringify(industryIdentifiers),
        publishedDate,
        description,
        categories: JSON.stringify(categories),
        pageCount,
        printType,
        maturityRating,
        language,
        averageRating: averageRating | 0,
        ratingsCount: ratingsCount | 0,
        thumbnail,
        images: JSON.stringify(images),
        link
      })
        .then(() => {
          return Book.addBookToShelf(
            volumeID,
            token,
            shelf,
            new Date()

          )
        }).then(() => {
          return res.status(201).json({success: 'BOOK_ADDED'})
        })
        .catch((error) => {
          console.log(error)
          return res.status(400).json({error: 'INTERNAL_ERROR'})
        })
    } catch (error) {
      console.log(error)
      return res.status(500).json({error: 'INTERNAL_ERROR'})
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
        return res.status(200).json({success: 'BOOK_DELETED'})
      }
    } catch (error) {
      return res.status(500).json({error: 'INTERNAL_ERROR'})
    }
  }
  async getBooks (req, res) {
    const token = req.token
    try {
      let count = await Book.countAllBookShelfs(token)
      let books = await Book.getBookShelfs(token)
      return res.status(200).json({count, books})
    } catch (error) {
      console.log(error)
      return res.status(500).json({error: 'INTERNAL_ERROR'})
    }
  }
  // TODO:: Generate documentation
  async getBookShelf (req, res) {
    let {shelf, page} = req.body
    const token = req.token
    if (!page || !Number.isInteger(page)) {
      return res.status(400).json({error: 'INVALID_PAGE'})
    }
    if (page < 1) {
      return res.status(400).json({error: 'MIN_PAGE_1'})
    }
    try {
      let books = await Book.getBookShelf(shelf, token, (page - 1) * 10)
      let count = await Book.countBooksOnShelf(shelf, token)
      return res.status(200).json({books, count})
    } catch (error) {
      return res.status(500).json({error: 'INTERNAL_ERROR'})
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
    if (!BookController.shelfTypes().includes(shelf)) return res.json({error: 'INVALID_SHELF'})
    try {
      let moveBook = await Book.updateUserBook(shelf, token, volumeID)
      if (moveBook) {
        return res.status(200).json({success: 'BOOK_MOVED'})
      }
    } catch (error) {
      return res.status(500).json({error: 'INTERNAL_ERROR'})
    }
  }

  /**
     * User rate book
     * @param req
     * @param res
     * @returns {Promise<*|Promise<any>>}
     */
  async rateBook (req, res) {
    const {volumeID, rating} = req.body
    const token = req.token
    if (rating > 5) return res.status(400).json({error: 'MAX_RATE_5'})
    if (rating < 1) return res.status(400).json({error: 'MIN_RATE_1'})
    try {
      let validateBook = await Book.validateBook(volumeID)
      console.log('validateBook', validateBook)
      if (validateBook) {
        return res.status(400).json({error: 'BOOK_NON_EXIST'})
      }
      let userRating = await Book.getUserRating(volumeID, token)
      console.log('userRating', userRating)

      if (!userRating) {
        await Book.addUserRating(volumeID, rating, token)
        return res.status(200).json({success: 'ADDED_RATING'})
      }
      if (userRating.rating !== rating) {
        await Book.updateUserRating(volumeID, rating, token)
        return res.status(200).json({success: 'UPDATED_RATING'})
      }

      return res.status(400).json({error: 'CANT_RATE_SAME'})
    } catch (error) {
      console.log(error)
      return res.status(500).json({error: 'INTERNAL_ERROR'})
    }
  }
}

module.exports = BookController
