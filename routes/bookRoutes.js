const bookRoutes = {
  // Book Api
  'POST /add': 'BookController.addBook',
  'PUT /move': 'BookController.moveBookToShelf',
  'POST /shelf/:shelfName': 'BookController.getBookShelf'
}

module.exports = bookRoutes
