/*
Requirements

Book
- ISBN              -String
- Title             -String
- Author            -[Number]
- Language          -String
- Publications      -Number
- NumOfPages        -Number
- Categories        -[String]

Author
- ID                -Number
- name              -String
- books             -[String]

Publication
- id                 -Number
- name               -String
- books              -[String]

-----APIs-----

Book
  -GET
    -to get all books 👌
    -to get specific books 👌
    -to get a list of books based on Category 👌
    -to get a list of books based on Author 

  -POST
    -to add new book
  
  -PUT
    -to update book details
    -to update/add new Author

  -DELETE
    -delete a book
    -delete an author from the book


Authors
  -GET
    -to get all authors
    -to get specific authors
    -to get a list of author based on a book

  -POST
    -to update new author
    -to update/add new book

  -PUT
    -update author details

  -DELETE
    -delete an author


Publications
  -GET
    -to get all Publication
    -to get specific Publication
    -to get a list of Publication based on a book

  -POST
    -to add new Publication

  -PUT
    -to update Publication
    -to update/add new book

  -DELETE
    -to delete a book from publication
    -to delete a publication

*/