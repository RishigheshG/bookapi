const Router = require("express").Router();

const AuthorModel = require("../schema/author");
const BookModel = require("../schema/book");


//GET

// Route   - /book
// Des     - to get all books
// Access  - Public
// Method  - GET
// Params  - none
// Body    - none 

Router.get("/",async (req,res) => {
    const getAllBooks = await BookModel.find();
    return res.json({book: getAllBooks});
});



// Route   - /book/:bookID
// Des     - to get a book based on ISBN
// Access  - Public
// Method  - GET
// Params  - bookID
// Body    - none

Router.get("/:bookID", async (req, res) => {
    const getSpecificBook = await BookModel.findOne({ISBN: req.params.bookID});
    
    if(!getSpecificBook){
        return res.json({
            error: `No book found for the ISBN of ${req.params.bookID}`,
        });
    }

    return res.json({ book: getSpecificBook });
});



// Route   - /book/c/:category
// Des     - to get a list of books based on category
// Access  - Public
// Method  - GET
// Params  - category
// Body    - none

Router.get("/c/:category", async (req, res) => {
    const getSpecificBooks = await BookModel.find({
        category: req.params.category,
    });

    if(!getSpecificBooks)
    {
        return res.json({
            error: `No book found for the category of ${req.params.category}`,
        });
    }
    return res.json({ books: getSpecificBooks });
});



// Route   - /book/a/:authorID
// Des     - to get a list of books based on authorID
// Access  - Public
// Method  - GET
// Params  - authorID
// Body    - none

Router.get("/a/:authorID", async (req, res) => {
    const getSpecificBooks = await BookModel.find({
        authors: parseInt(req.params.authorID),
    });

    if(!getSpecificBooks)
    {
        return res.json({
            error: `No book found for the author id of ${req.params.authorID}`,
        });
    }
    return res.json({ books: getSpecificBooks });
});


//POST

// Route   - /book/new
// Des     - add new book
// Access  - Public
// Method  - POST
// Params  - none

Router.post("/new", async (req, res) => {
    try{
        const { newBook } = req.body;

        const bookExist = await BookModel.findOne({ISBN: newBook.ISBN});
        if(!bookExist){
            await BookModel.create(newBook);
            return res.json({message: "Book added to the database"});
        }
        return res.json({error: `Book with same ISBN: ${newBook.ISBN} is already present in the database`});
    } catch(error){
        return res.json({error: error.message});
    }
});


//PUT

// Route   - /book/update/:isbn
// Des     - update any detils of book
// Access  - Public
// Method  - PUT
// Params  - ISBN

Router.put("/update/:isbn", async (req, res) => {
    const { updatedBook } = req.body;
    const { isbn } = req.params;

    const updateBook = await BookModel.findOneAndUpdate(
        {
            ISBN: isbn
        },
        {
            $set: {
                    ...updatedBook, 
                },
        },
        {
            new: true
        }
    );

    return res.json({ book: updateBook });
});



// Route   - /book/updateAuthor/:isbn
// Des     - update/add new author to a book
// Access  - Public
// Method  - PUT
// Params  - ISBN

Router.put("/updateAuthor/:isbn", async (req, res) => {
    const { newAuthor } = req.body;
    const { isbn } = req.params;

    const updatedBook = await BookModel.findOneAndUpdate(
        {
            ISBN: isbn
        },
        {
            $addToSet: {
                authors: parseInt(newAuthor)
            },
        },
        {
            new: true
        }
    );

    const updatedAuthor = await AuthorModel.findOneAndUpdate(
        {
            id: parseInt(newAuthor)
        },
        {
            $addToSet: {
                books: isbn
            },
        },
        {
            new: true
        }
    );

    return res.json({book: updatedBook, author: updatedAuthor, message: "New author was added into the database"});
});


// Route   - /book/updateTitle/:isbn
// Des     - update title of a book
// Access  - Public
// Method  - PUT
// Params  - id

Router.put("/updateTitle/:isbn", async (req, res) => {
    const { title } = req.body;

    const updateBook = await BookModel.findOneAndUpdate(
        {
            ISBN: req.params.isbn
        },
        {
            title: title
        },
        {
            new: true
        }
    );
    
    return res.json({book: updateBook});
});




//DELETE

// Route   - /book/delete/:isbn
// Des     - delete a book
// Access  - Public
// Method  - DELETE
// Params  - isbn

Router.delete("/delete/:isbn", async (req, res) => {
    const { isbn } = req.params;

    const updateBookDatabase = await BookModel.findOneAndDelete({
        ISBN: isbn
    });
    return res.json({books: updateBookDatabase});
});



// Route   - /book/delete/author/:isbn/:id
// Des     - delete an author from a book
// Access  - Public
// Method  - DELETE
// Params  - isbn, id

Router.delete("/delete/author/:isbn/:id", async (req, res) => {
    const { isbn, id } = req.params;
    const updateBook = await BookModel.findOneAndUpdate(
        {
            ISBN: isbn,
        },
        {
            $pull: {
                authors: parseInt(id),
            },
        },
        {
            new: true,
        });

    const updateAuthor = await AuthorModel.findOneAndUpdate(
        {
            id: parseInt(id),
        },
        {
            $pull: {
                books: isbn,
            },
        },
        {
            new: true,
        });

    
    return res.json({message: "Author was deleted",
                     book: updateBook,
                     author: updateAuthor});
});


module.exports = Router;