var _ = require('lodash')
var querystring = require('querystring')
const request = require('request-promise-native')
// Added async/await -- Forrest92

// https://developers.google.com/books/docs/v1/using#st_params

// Special Keywords
const fields = {
  title: 'intitle:',
  author: 'inauthor:',
  publisher: 'inpublisher:',
  subject: 'subject:',
  isbn: 'isbn:'
}

// Base url for Google Books API
const API_BASE_URL = 'https://www.googleapis.com/books/v1'

/**
 * Search Google Books
 *
 * https://developers.google.com/books/docs/v1/reference/volumes/list
 *
 * @param  {String}   query
 * @param  {object}   options
 * @param  {Function} callback
*/

const search = async (query, options) => {
  // Make the options object optional

  // Validate options
  if (!query) {
    return Promise.reject(new Error('Query is required'))
  }

  if (options.offset < 0) {
    return Promise.reject(new Error('Offset cannot be below 0'))
  }

  if (options.limit < 1 || options.limit > 40) {
    return Promise.reject(new Error('Limit must be between 1 and 40'))
  }

  // Set any special keywords
  if (options.field) {
    query = fields[options.field] + query
  }

  // Create the request uri
  query = {
    q: query,
    startIndex: options.offset,
    maxResults: options.limit,
    printType: options.type,
    orderBy: options.order,
    langRestrict: options.lang
  }

  if (options.key) {
    query.key = options.key
  }

  return sendRequest('/volumes', query).then(response => {
    if (!_.isArray(response.items)) {
      return []
    }

    let results = _.chain(response.items)
      .map(parseBook)
      .compact()
      .value()

    return (results)
  }).catch(error => error)
}

/**
 * Retrieves a Volume resource based on ID.
 *
 * https://developers.google.com/books/docs/v1/reference/volumes/get
 *
 * @param  {String}   volumeId
 * @param  {Function} callback
 */
const lookup = async (volumeId, options) => {
  var query = {}

  if (!volumeId) {
    return Promise.reject(new Error('Volume ID is required'))
  }

  if (options.key) {
    query.key = options.key
  }

  return sendRequest('/volumes/' + volumeId, query).then(response => {
    if (!response.id || response.id !== volumeId) {
      return []
    }

    return parseBook(response)
  })
}

/**
 * Send a Google Books API request
 *
 * @return {void}
 */
const sendRequest = async (path, params) => {
  let url = API_BASE_URL
  if (path) {
    url += path
  }

  if (params) {
    url += '?' + querystring.stringify(params)
  }

  return request({url}).then(response => {
    try {
      return JSON.parse(response)
    } catch (e) {
      Promise.reject(new Error('Invalid response from Google Books API.'))
    }
  }).catch(error => error)
}

/**
 * Parse a single book result
 *
 * @param  {Object}  data
 * @return {Object}
 */
var parseBook = function (data) {
  var book = _.pick(data.volumeInfo, [
    'title', 'subtitle', 'authors', 'publisher', 'publishedDate', 'description',
    'industryIdentifiers', 'pageCount', 'printType', 'categories', 'averageRating',
    'ratingsCount', 'maturityRating', 'language'
  ])

  _.extend(book, {
    volumeID: data.id,
    link: data.volumeInfo.canonicalVolumeLink,
    thumbnail: _.get(data, 'volumeInfo.imageLinks.thumbnail'),
    images: _.pick(data.volumeInfo.imageLinks, ['small', 'medium', 'large', 'extraLarge'])
  })

  return book
}

module.exports.search = search
module.exports.lookup = lookup
