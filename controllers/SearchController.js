const {defaultOptions} = require('../config')
const books = require('../api')
const Book = require('../models/BookModel')
class SearchController {
  /**
     * Sets allowed options
     */
  static getAllowedOptions () {
    return {
      searchType: ['books', 'magazines', 'all'],
      orderTypes: ['relevance', 'newest'],
      fieldTypes: ['title', 'author', 'publisher', 'subject', 'isbn'],
      maxLimit: 40
    }
  }
  /**
     * Gets results from search query
     * @param req
     * @param res
     * @returns {*|Promise<any>}
     */
  async search (req, res) {
    const {query, options} = req.body
    const token = req.token
    if (!query) return res.status(400).json({error: 'INVALID_QUERY'})
    if (options) {
      if (options.key) delete options.key
      if (options.limit && !Number.isInteger(options.limit)) return res.status(400).json({error: 'LIMIT_NOT_VALID'})
      if (options.startIndex && !Number.isInteger(options.startIndex)) return res.status(400).json({error: 'INDEX_NOT_VALID'})
      if (options.limit < 1) return res.status(400).json({error: 'MIN_LIMIT_1'})
      if (options.limit > SearchController.getAllowedOptions().maxLimit) return res.status(400).json({error: 'MAX_LIMIT_40'})
      if (options.startIndex < 1) return res.status(400).json({error: 'MIN_LIMIT_1'})

      if (options.field && !SearchController.getAllowedOptions().fieldTypes.includes(options.field)) return res.status(400).json({error: 'INVALID_FIELD_TYPE'})
      if (options.orderBy && !SearchController.getAllowedOptions().orderTypes.includes(options.orderBy)) return res.status(400).json({error: 'INVALID_ORDER_BY_TYPE'})
      if (options.resultType && !SearchController.getAllowedOptions().searchType.includes(options.searchType)) return res.status(400).json({error: 'INVALID_RESULT_TYPE'})
    }
    try {
      let bookResults = await books.search(query, Object.assign(defaultOptions, options))
      if (bookResults.length === 0) {
        return res.status(400).json({error: 'NO_RESULTS'})
      }

      let resultIDS = bookResults.map(result => { return result.id })
      let userBooks = await Book.getUserBooksByVolumeIDS(token, resultIDS)
      let newBooks = bookResults.map(result => {
        if (userBooks.find(book => book.volumeID === result.id) === undefined) {
          return result
        }
      })
      return res.status(200).json({books: newBooks.filter(book => book)})
    } catch (error) {
      return res.status(500).json({error: 'INTERNAL_ERROR'})
    }
  }

  /**
     * Looks up single query
     * @param req
     * @param res
     * @returns {*|Promise<any>}
     */
  async lookup (req, res) {
    const {volumeID} = req.body
    if (!volumeID) return res.status(400).json({error: 'INVALID_VOLUMEID'})
    await books.lookup(volumeID, defaultOptions.key).then(results => {
      return res.status(200).json({book: results})
    }).catch(error => {
      return res.status(400).json({error})
    })
  }
}

module.exports = SearchController
