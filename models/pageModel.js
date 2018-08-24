const { query, execute} = require('../config/database')
const rand = require('random-key')

const pageModel = () => {
  const addPage = async (token) => {
    return execute('INSERT INTO pages SET token=?', token)
      .then(results => {
        return results
      }).catch((error) => {
        return error
      })
  }
  const validatePage = async (token) => {
    return query('SELECT * FROM pages WHERE token=?', token)
      .then(rows => {
        return rows.length === 0 || rows === undefined
      }).catch((error) => {
        return error
      })
  }
  const generatePageToken = async () => {
    let trys = 0; const maxTrys = 10
    let token = rand.generate()
    while (!validatePage(token)) {
      token = rand.generate()
      if (trys > maxTrys) {
        return Promise.reject(new Error(`Could not generate token`))
      }
      trys++
    }
    return token
  }
  return {
    addPage,
    validatePage,
    generatePageToken
  }
}

module.exports = pageModel
