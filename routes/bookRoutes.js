const bookRoutes = {
  'POST /search': 'SearchController.search', // Done
  'POST /lookup': 'SearchController.lookup', // Done
  // Book Api
  'GET /': 'BookController.getBooks', // Done
  'POST /shelf': 'BookController.getBookShelf', // Done
  'POST /rate': 'BookController.rateBook', // Done
  'POST /add': 'BookController.addBook', // Done
  'PUT /move': 'BookController.moveBookToShelf'// Done
}

module.exports = bookRoutes
