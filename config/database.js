const mysql = require('mysql2/promise')
const {mysqlConfig} = require('../config')
const db = mysql.createPool(mysqlConfig)
const query = async (sql, ...args) => {
  [...args].map(arg => mysql.escape(arg))
  return db.getConnection()
    .then(conn => {
      const res = conn.query(sql, [...args])
      conn.release()
      return res
    }).then(([rows]) => {
      return rows
    }).catch(error => {
      return error
    })
}
const execute = async (sql, ...args) => {
  [...args].map(arg => mysql.escape(arg))
  return db.getConnection()
    .then(conn => {
      const res = conn.execute(sql, [...args])
      conn.release()
      return res
    }).then(results => {
      return results
    }).catch(error => {
      console.log(error)
      return error
    })
}
module.exports = {db, execute, query}
