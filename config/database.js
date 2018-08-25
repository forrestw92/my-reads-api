const mysql = require('mysql2/promise')
const {mysqlConfig} = require('../config')
const db = mysql.createPool(mysqlConfig)

/**
 * Shortens mysql query
 * @param sql
 * @param args
 * @returns {Promise<PromiseLike<*[] | never>>}
 */
const query = async (sql, ...args) => {
  [...args].map(arg => mysql.escape(arg))
  return db.getConnection()
    .then(conn => {
      const res = conn.query(sql, [...args])
      conn.release()
      return res
    }).then(([rows]) => {
      return rows
    })
}
/**
 * Shortens mysql execute
 * @param sql
 * @param args
 * @returns {Promise<PromiseLike<T | never>>}
 */
const execute = async (sql, ...args) => {
  [...args].map(arg => mysql.escape(arg))
  return db.getConnection()
    .then(conn => {
      const res = conn.execute(sql, [...args])
      conn.release()
      return res
    }).then(results => {
      return results
    })
}
module.exports = {db, execute, query}
