const Page = require('../models/pageModel')
const PageController = () => {
  const getNew = async (req, res) => {
    try {
      const token = await Page().generatePageToken()
      await Page().addPage(token)
        .then(results => {
          if (results[0].affectedRows === 1) {
            return res.status(201).json({success: "Page created! Don't forget new url."})
          }
          return res.status(400).json({error: 'Something happend please try again?'})
        }).catch(() => {
          return res.status(500).json({error: 'Internal Error!'})
        })
    } catch (error) {
      return res.status(500).json({error: 'Internal Error!'})
    }
  }
  return {getNew}
}

module.exports = PageController
