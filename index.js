require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");

//Schema Import
const Book = require("./schema/book.js");
const Author = require("./schema/author.js");
const Publication = require("./schema/publication.js");

//database
const Database = require("./database")

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("Connected to MongoDB!"))
.catch((err) => {
  console.log(err);
});

//initialization
const OurAPP = express();

OurAPP.use(express.json());

OurAPP.get("/", (request, response) => {
  response.json({message: "Server is working!"});
});

//Route   - /book
//Des     - To get all books
//Access  - Public
//Methods - GET
//Params  - none
//Body    - none
OurAPP.get("/book" , async(req,res) => {
  const getAllBooks = await Book.find();
  return res.json(getAllBooks);
})

//Route   - /book/:bookID
//Des     - To get a book based on ISBN
//Access  - Public
//Methods - GET
//Params  - bookID
//Body    - none
OurAPP.get("/book/:bookID" , async (req,res) => {
  const getSpecificBook = await Book.findOne({ISBN: req.params.bookID})

  if(!getSpecificBook){
    return res.json({
      error: `No book found for the ISBN of ${req.params.bookID}`
    })
  }

  return res.json({book: getSpecificBook});
})

//Route   - /book/c/:category
//Des     - To get a list of books based on Category
//Access  - Public
//Methods - GET
//Params  - bookID
//Body    - none

OurAPP.get("/book/c/:category" , async(req,res) => {
  const getSpecificBooks = await BookModel.findOne({category: req.params.category});

  if(!getSpecificBooks){
    return res.json({error: `No book found for the category ${req.params.category}`});
  }

  return res.json({books: getSpecificBooks});
});

//Route   - /author
//Des     - To get all authors
//Access  - Public
//Methods - GET
//Params  - none
//Body    - none

OurAPP.get("/author" , async(req,res) => {
  const getAllAuthors = await Author.find();
  return res.json({author: getAllAuthors});
});

//Route   - /book/new
//Des     - Add new book
//Access  - Public
//Methods - POST
//Params  - none
//Body    - none

OurAPP.post("/book/new" , async(req,res) => {
  try{
    const {newBook} = req.body;
    await Book.create(newBook);
    return res.json({message: "Book added to the database"});
  }catch(error){
    return res.json({error: error.message});
  }
});

//Route   - /author/new
//Des     - Add new author
//Access  - Public
//Methods - POST
//Params  - none
//Body    - none

OurAPP.post("/author/new", (req,res) => {
  const {newAuthor} = req.body;

  console.log(newAuthor);

  return res.json({message: "author was added!"});
});

//Route   - /publication/new
//Des     - Add new publication
//Access  - Public
//Methods - POST
//Params  - none
//Body    - none

OurAPP.post("/publication/new", (req,res) => {
  const publication = req.body;

  console.log(publication);

  return res.json({message: "publication was added!"});
});

//Route   - /book/update/:isbn
//Des     - to update any details of the book
//Access  - Public
//Methods - PUT
//Params  - ISBN
//Body    - none

OurAPP.put("/book/update/:isbn", (req,res) => {
  const {updatedBook} = req.body;
  const {isbn} = req.params;

  const book = Database.Book.map((book) => {
    if(book.ISBN === isbn) {
      return {...book, ...updatedBook};
    }
    return book;
  })

  return res.json(book);
});

//Route   - /bookAuthor/update/:isbn
//Des     - update/add new author to the book
//Access  - Public
//Methods - PUT
//Params  - ISBN
//Body    - none

OurAPP.put("/bookAuthor/update/:isbn", (req,res) => {
  const {newAuthor} = req.body;
  const {isbn} = req.params;

  const book = Database.Book.map((book) => {
    if(book.ISBN === isbn){
      if(!book.authors.includes(newAuthor)){
        return book.authors.push(newAuthor);
      }
      return book;
    }
    return book;
  })

  const author = Database.Author.map((author) => {
    if(author.id === newAuthor){
      if(!author.books.includes(isbn)){
        return author.books.push(isbn);
      }
      return author;
    }
    return author;
  })

  return res.json({book: Database.Book, author: Database.Author});
});

//Route   - /author/update/:id
//Des     - update any details of the author
//Access  - Public
//Methods - PUT
//Params  - id
//Body    - none

OurAPP.put("/author/update/:id", (req, res) => {
  const {updateAuthor} = req.body;
  const {id} = req.params;

  const author = Database.Author.map((author) => {
    if(author.id === parseInt(id)){
      return {...author, ...updateAuthor}
    }
    return author
  })

  return res.json(author);
});

//Route   - /book/updateTitle/:isbn
//Des     - update title of a book
//Access  - Public
//Methods - PUT
//Params  - isbn
//Body    - none

OurAPP.put("/book/updateTitle/:isbn", (req,res) => {
  const {updatedBook} = req.body;
  const {isbn} = req.params;

  Database.Book.forEach((book) => {
    if(book.ISBN === isbn) {
      book.title = updatedBook.title;
      return;
    }
    return book;
  });

  return res.json(Database.Book);
});

//Route   - /book/delete/:isbn
//Des     - delete a book
//Access  - Public
//Methods - DELETE
//Params  - isbn
//Body    - none

OurAPP.delete("/book/delete/:isbn", (req,res) => {
  const {isbn} = req.params;

  const filteredBooks = Database.Book.filter((book) => book.ISBN !== isbn);

  Database.Book = filteredBooks;

  return res.json(Database.Book);
});

//Route   - /book/delete/author
//Des     - delete an author from a book
//Access  - Public
//Methods - DELETE
//Params  - isbn, id
//Body    - none

OurAPP.delete("/book/delete/author/:isbn/:id", (req,res) => {
  const {isbn,id} = req.params;

  Database.Book.forEach((book) => {
    if(book.ISBN === isbn){
      if(!book.authors.includes(parseInt(id))){
        return book;
      }

      book.authors = book.authors.filter((databaseId) => databaseId!== parseInt(id))

      return book;
    }
    return book;
  })

  Database.Author.forEach((author) =>{
    if(author.id === parseInt(id)){
      if(!author.books.includes(isbn)){
        return author;
      }
      
      author.books = author.books.filter((book) => book !== isbn)

      return author;
    }
    return author;
  })

  return res.json({book: Database.Book, author: Database.Author})
});

//Route   - /author/delete
//Des     - delete an author
//Access  - Public
//Methods - DELETE
//Params  - id
//Body    - none

OurAPP.delete("/author/delete/:id", (req,res) => {
  const {id} = req.params;
  
  const filteredAuthors = Database.Author.filter((author) => author.id !== parseInt(id, 10));

  Database.Author = filteredAuthors;

  return res.json(Database.Author);
});

//Route   - /publication/delete
//Des     - delete a publication
//Access  - Public
//Methods - DELETE
//Params  - id
//Body    - none

OurAPP.delete("/publication/delete/:id", (req,res) => {
  const {id} = req.params;

  const filteredPub = Database.Publication.filter((pub) => pub.id !== parseInt(id));

  Database.Publication = filteredPub;

  return res.json(Database.Publication);
});

//Route   - /publication/delete/book
//Des     - delete a book from a publication
//Access  - Public
//Methods - DELETE
//Params  - id, isbn
//Body    - none

OurAPP.delete("/publication/delete/book/:isbn/:id", (req,res) => {
  const {id,isbn} = req.params;

  Database.Book.forEach((book) => {
    if(book.ISBN === isbn){
      book.publication = 0;
      return book;
    }
    return book;
  })

  Database.Publication.forEach((publication) => {
    if(publication.id === parseInt(id)){
      const filteredBooks = publication.books.filter(
        (book) => book !== isbn
      );
      publication.books = filteredBooks;
      return publication;
    }
    return publication;
  });
  return res.json({book: Database.Book, publication: Database.Publication});
});

OurAPP.listen(4000, () => console.log("Server is running!"));