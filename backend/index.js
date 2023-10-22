import express, { request, response } from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { Book } from "./models/bookModel.js";

const app = express();

dotenv.config();

// Destructuring of process.env variables
const { PORT, DB_URL } = process.env;

// Middleware for parsing request body
app.use(express.json());

app.get("/", (request, response) => {
  console.log(request);
  return response.status(234).send("Welcome to MERN Stack Tutorial");
});

// Add new books
app.post("/books", async (request, response) => {
  try {
    if (
      !request.body.title ||
      !request.body.author ||
      !request.body.publishYear
    ) {
      return response.status(400).send({
            message: "Send all required fields: title, author, publishYear", 
        });
    }
    const newBook = {
      title: request.body.title,
      author: request.body.author,
      publishYear: request.body.publishYear,
    };

    const book = await Book.create(newBook);

    return response.status(201).send(book);
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

// Get ALL Books from database
app.get("/books", async (request, response) => {
  try {
    const books = await Book.find({});
    return response.status(200).json({ 
      count: books.length,
      data: books,
     });
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
})

// Get ONE Book from database
app.get("/books/:id", async (request, response) => {
  try {

    const { id } = request.params;

    const book = await Book.findById(id);
    return response.status(200).json(book);
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
})

mongoose
  .connect(DB_URL)
  .then(() => {
    console.log("Connected to remote database");
    app.listen(PORT, () => {
      console.log(`App listening on port: ${PORT}`);
    });
  })
  .catch ((error) => {
    console.log(error);
  });