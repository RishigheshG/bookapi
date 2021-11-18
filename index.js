const express = require("express");

//database
const Database = require("./database")

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
OurAPP.get("/book" , (req,res) => {
  return res.json({books: Database.Book});
})

//Route   - /book/:bookID
//Des     - To get a book based on ISBN
//Access  - Public
//Methods - GET
//Params  - bookID
//Body    - none
OurAPP.get("/book/:bookID" , (req,res) => {
  const getBook = Database.Book.filter(
      (book) => book.ISBN === req.params.bookID
    );

  return res.json({book: getBook});
})

//Route   - /book/c/:category
//Des     - To get a list of books based on Category
//Access  - Public
//Methods - GET
//Params  - bookID
//Body    - none

OurAPP.get("/book/c/:category" , (req,res) => {
  const getBook = Database.Book.filter(
      (book) => book.category.includes(req.params.category)
    );

  return res.json({book: getBook});
})

//Route   - /author
//Des     - To get all authors
//Access  - Public
//Methods - GET
//Params  - none
//Body    - none

OurAPP.get("/author" , (req,res) => {
  return res.json({author: Database.Author});
})

//Route   - /book/new
//Des     - Add new book
//Access  - Public
//Methods - POST
//Params  - none
//Body    - none

OurAPP.post("/book/new" , (req,res) => {
  console.log(req.body);
  return res.json({message: "Book Added Successfully!"});
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

OurAPP.listen(4000, () => console.log("Server is running!"));