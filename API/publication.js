const Router = require("express").Router();

const BookModel = require("../schema/book");
const PublicationModel = require("../schema/publication");


//GET

// Route   - /publication
// Des     - to get all publication
// Access  - Public
// Method  - GET
// Params  - none
// Body    - none

Router.get("/", async (req,res) => {
    const getAllPublications = await PublicationModel.find();
    return res.json({publication: getAllPublications});
});



// Route   - /publication/:publicationID
// Des     - to get a specific publication based on id
// Access  - Public
// Method  - GET
// Params  - publicationID
// Body    - none

Router.get("/:publicationID", async (req, res) => {
    const getSpecificPublication = await PublicationModel.findOne({
        id: parseInt(req.params.publicationID)});
    
    if(!getSpecificPublication){
        return res.json({
            error: `No author found for the id of ${req.params.publicationID}`,
        });
    }

    return res.json({ publication: getSpecificPublication });
});


//POST

// Route   - /publication/new
// Des     - add new publication
// Access  - Public
// Method  - POST
// Params  - none

Router.post("/new", async (req, res) => {
    try{
        const { newPublication } = req.body;

        const publicationExist = await PublicationModel.findOne({id: newPublication.id});
        if(!publicationExist){
            await PublicationModel.create(newPublication);
            return res.json({message: "Publication added to the database"});
        }
        return res.json({error: `Publication with same id: ${newPublication.id} is already present in the database`});
    } catch(error){
        return res.json({error: error.message});
    }
});


//PUT


// Route   - /publication/update/:id
// Des     - update any details of the publication
// Access  - Public
// Method  - PUT
// Params  - id

Router.put("/update/:id", async (req, res) => {
    const { updatedPublication } = req.body;
    const { id } = req.params;

    const updatePublication = await PublicationModel.findOneAndUpdate(
        {
            id: parseInt(id),
        },
        {
            $set: {
                    ...updatedPublication, 
                },
        },
        {
            new: true
        }
    );

    return res.json({ publication: updatePublication });
});



//DELETE

// Route   - /publication/delete/:id
// Des     - delete a publication
// Access  - Public
// Method  - DELETE
// Params  - id

Router.delete("/delete/:id", async (req, res) => {
    const { id } = req.params;
    
    const updatePublicationDatabase = await PublicationModel.findOneAndDelete({
        id: id
    });
    return res.json({publications: updatePublicationDatabase});
});



// Route   - /publication/delete/book/:isbn/:Id
// Des     - delete a book from publication
// Access  - Public
// Method  - DELETE
// Params  - id, isbn

Router.delete("/delete/book/:isbn/:id", async (req, res) => {
    const { isbn, id } = req.params;

    const updateBook = await BookModel.findOneAndUpdate(
        {
            ISBN: isbn,
        },
        {
            $set: {
                publication: 0,
            },
        },
        {
            new: true,
        });

    const updatePublication = await PublicationModel.findOneAndUpdate(
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

    
    return res.json({message: "Publication was deleted",
                     book: updateBook,
                     publication: updatePublication});
});


module.exports = Router;