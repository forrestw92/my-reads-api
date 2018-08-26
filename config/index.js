
const ApiKey = 'GOOGLE_BOOKS_KEY'
const mysqlConfig = {
  connectionLimit: 100,
  database: 'db',
  user: 'user',
  password: 'password',
  host: 'localhost'
}
const defaultOptions = {
  key: ApiKey,
  field: 'title',
  offset: 0,
  limit: 10,
  type: 'all',
  order: 'relevance',
  lang: 'en'
}

module.exports = {ApiKey, defaultOptions, mysqlConfig}
