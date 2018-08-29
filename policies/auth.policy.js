const TokenModel = require('../models/TokenModel')
const Book = require('../models/BookModel')

/**
 * Checks for user authorization token
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
module.exports = async (req, res, next) => {
    let tokenToVerify
    if (req.header('Authorization')) {
        tokenToVerify = req.header('Authorization')
    } else if (req.body.token) {
        tokenToVerify = req.body.token
        delete req.query.token
    } else {
        return res.status(401).json({ error: 'NO_TOKEN_FOUND' })
    }
    try {
        let isValidToken = await TokenModel.validateToken(tokenToVerify)
        if (isValidToken) {
            req.token = tokenToVerify
        } else {
            let addToken = TokenModel.addToken(tokenToVerify)
            if (addToken) {
                await Book.addBooksToShelf(tokenToVerify)
                req.token = tokenToVerify
            }
        }
        next()
    } catch (error) {
        return res.status(500).json({error: 'INTERNAL_ERROR'})
    }
}

