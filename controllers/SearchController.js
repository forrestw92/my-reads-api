const {defaultOptions} = require('../config')
const books = require('google-books-search')
class SearchController {
  constructor () {
    this.searchType = ['books', 'magazines']
    this.orderTypes = ['relevance', 'newest']
    this.fieldTypes = ['title', 'author', 'publisher', 'subject', 'isbn']
    this.maxLimit = 40
  }
  /**
     * Gets results from search query
     * @param req
     * @param res
     * @returns {*|Promise<any>}
     */
  async search (req, res) {
    const {query, options} = req.body
    if (!query) return res.status(400).json({error: 'Please fill out query field.'})
    if (options) {
      if (options.limit > this.maxLimit) return res.status(400).json({error: 'Max limit of results is 40. Please fix options.'})
      if (options.field && !this.fieldTypes.includes(options.field)) return res.status(400).json({error: 'Please request a valid field type.'})
      if (options.orderBy && !this.orderTypes.includes(options.orderBy)) return res.status(400).json({error: 'Please request a valid orderBy type.'})
      if (options.resultType && !this.searchType.includes(options.searchType)) return res.status(400).json({error: 'Please request a valid search type.'})
    }
    books.search(query, options || defaultOptions, function (error, results) {
      if (error) {
        return res.status(500).json({error: 'Internal Error!'})
      }
      if (results.length === 0) {
        return res.status(400).json({error: 'No results found with that query. Please try again.'})
      }
      return res.status(200).json({books: results})
    })
  }

  /**
     * Looks up single query
     * @param req
     * @param res
     * @returns {*|Promise<any>}
     */
  async lookup (req, res) {
    const {volumeID} = req.body
    if (!volumeID) return res.status(400).json({error: 'Please provide a volumeID field'})
    books.lookup(volumeID, defaultOptions.key, function (error, results) {
      if (error) {
        return res.status(400).json({error})
      }
      return res.status(200).json({book: results})
    })
  }
}

module.exports = SearchController
