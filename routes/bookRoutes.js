const bookRoutes = {
  'POST /search': 'SearchController.search', // Done
  'POST /lookup': 'SearchController.lookup', // Done
  // Book Api
  'POST /add': 'BookController.addBook',
  'PUT /move': 'BookController.moveBookToShelf',
  'POST /shelf/:shelfName': 'BookController.getBookShelf'
}

module.exports = bookRoutes
