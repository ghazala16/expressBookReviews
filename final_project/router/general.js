const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


// Task 6: Register a new user
public_users.post("/register", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    if (users.some(user => user.username === username)) {
        return res.status(409).json({ message: "User already exists" });
    }

    users.push({ username, password });
    return res.status(201).json({ message: "User registered successfully" });
});


// Task 1: Get the book list available in the shop
public_users.get('/', (req, res) => {
    return res.status(200).send(JSON.stringify(books, null, 4));
});

// Task 2: Get book details based on ISBN
public_users.get('/isbn/:isbn', (req, res) => {
    const isbn = req.params.isbn;
    const book = books[isbn];

    if (book) {
        return res.status(200).send(book);
    } else {
        return res.status(404).json({ message: "Book not found" });
    }
});

// Task 3: Get book details based on author
public_users.get('/author/:author', (req, res) => {
    const author = req.params.author;
    const filteredBooks = Object.values(books).filter(book => book.author === author);
    return res.status(200).send(filteredBooks);
});

// Task 4: Get all books based on title
public_users.get('/title/:title', (req, res) => {
    const title = req.params.title;
    const filteredBooks = Object.values(books).filter(book => book.title === title);
    return res.status(200).send(filteredBooks);
});

// Task 5: Get book review
public_users.get('/review/:isbn', (req, res) => {
    const isbn = req.params.isbn;
    const book = books[isbn];

    if (book) {
        return res.status(200).send(book.reviews);
    } else {
        return res.status(404).json({ message: "Book not found" });
    }
});


/* ------------------- Promises / Async-Await for Tasks 10-13 ------------------- */

// Task 10: Get all books using async/await
public_users.get('/async-books', async (req, res) => {
    try {
        const response = await axios.get('http://localhost:5000/');
        return res.status(200).send(response.data);
    } catch (err) {
        return res.status(500).json({ message: "Error fetching books" });
    }
});

// Task 11: Get book details by ISBN using async/await
public_users.get('/async-isbn/:isbn', async (req, res) => {
    const isbn = req.params.isbn;
    try {
        const response = await axios.get(`http://localhost:5000/isbn/${isbn}`);
        return res.status(200).send(response.data);
    } catch (err) {
        return res.status(404).json({ message: "Book not found with this ISBN" });
    }
});

// Task 12: Get books by author using async/await
public_users.get('/async-author/:author', async (req, res) => {
    const author = req.params.author;
    try {
        const response = await axios.get(`http://localhost:5000/author/${author}`);
        return res.status(200).send(response.data);
    } catch (err) {
        return res.status(404).json({ message: "Books not found for this author" });
    }
});

// Task 13: Get books by title using async/await
public_users.get('/async-title/:title', async (req, res) => {
    const title = req.params.title;
    try {
        const response = await axios.get(`http://localhost:5000/title/${title}`);
        return res.status(200).send(response.data);
    } catch (err) {
        return res.status(404).json({ message: "Books not found for this title" });
    }
});


module.exports.general = public_users;
