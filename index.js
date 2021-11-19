require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");

//Schema Import
const BookModel = require("./schema/book.js");
const AuthorModel = require("./schema/author.js");
const PublicationModel = require("./schema/publication.js");

//API Import
const Book = require("./API/book.js");
const Author = require("./API/author.js");
const Publication = require("./API/publication.js");

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

//Microservices
OurAPP.use("/book", Book);
OurAPP.use("/author", Author);
OurAPP.use("/publication", Publication);

OurAPP.get("/", (request, response) => {
  response.json({message: "Server is working!"});
});

OurAPP.listen(4000, () => console.log("Server is running!"));