const Router = require("express").Router();

const AuthorModel = require("../schema/author");

//GET

// Route   - /author
// Des     - to get all authors
// Access  - Public
// Method  - GET
// Params  - none
// Body    - none

Router.get("/", async (req,res) => {
    const getAllAuthors = await AuthorModel.find();
    return res.json({author: getAllAuthors});
});



// Route   - /author/:authorID
// Des     - to get a specific author based on id
// Access  - Public
// Method  - GET
// Params  - authorID
// Body    - none

Router.get("/:authorID", async (req, res) => {
    const getSpecificAuthor = await AuthorModel.findOne({
        id: parseInt(req.params.authorID)});
    
    if(!getSpecificAuthor){
        return res.json({
            error: `No author found for the id of ${req.params.authorID}`,
        });
    }

    return res.json({ author: getSpecificAuthor });
});


//POST

// Route   - /author/new
// Des     - add new author
// Access  - Public
// Method  - POST
// Params  - none

Router.post("/new", async (req, res) => {
    try{
        const { newAuthor } = req.body;

        const authorExist = await AuthorModel.findOne({id: newAuthor.id});
        if(!authorExist){
            await AuthorModel.create(newAuthor);
            return res.json({message: "Author added to the database"});
        }
        return res.json({error: `Author with same id: ${newAuthor.id} is already present in the database`});
    } catch(error){
        return res.json({error: error.message});
    }
});


//PUT

// Route   - /author/update/:id
// Des     - update any details of the author
// Access  - Public
// Method  - PUT
// Params  - id

Router.put("/update/:id", async (req, res) => {
    const { updatedAuthor } = req.body;
    const { id } = req.params;

    const updateAuthor = await AuthorModel.findOneAndUpdate(
        {
            id: parseInt(id),
        },
        {
            $set: {
                    ...updatedAuthor, 
                },
        },
        {
            new: true
        }
    );

    return res.json({ author: updateAuthor });
});


// Route   - /author/updateName/:id
// Des     - update name of a author
// Access  - Public
// Method  - PUT
// Params  - id

Router.put("/updateName/:id", async (req, res) => {
    const { name } = req.body;

    const updateAuthor = await AuthorModel.findOneAndUpdate(
        {
            id: req.params.id
        },
        {
            name: name
        },
        {
            new: true
        }
    );
    
    return res.json({author: updateAuthor});
});



//DELETE


// Route   - /author/delete/:id
// Des     - delete an author
// Access  - Public
// Method  - DELETE
// Params  - id

Router.delete("/delete/:id", async (req, res) => {
    const { id } = req.params;

    const updateAuthorDatabase = await AuthorModel.findOneAndDelete({
        id: id
    });
    return res.json({authors: updateAuthorDatabase});
});


module.exports = Router;