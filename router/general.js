const express = require('express');
let books = require("./booksdb.js").books;
let users = require("./auth_users.js").users; // shared array
const public_users = express.Router();

// Task 6: Register new user
public_users.post("/register", (req,res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    if (users.find(u => u.username === username)) {
        return res.status(409).json({ message: "Username already exists" });
    }

    users.push({ username: username, password: password });
    return res.status(200).json({ message: "User registered successfully" });
});

// Task 1: Get all books
public_users.get('/', (req, res) => {
    return res.status(200).json(books);
});

// Task 2: Get book by ISBN
public_users.get('/isbn/:isbn', (req, res) => {
    const isbn = req.params.isbn;
    if (books[isbn]) {
        return res.status(200).json(books[isbn]);
    } else {
        return res.status(404).json({ message: "Book not found" });
    }
});

// Task 3: Get books by author
public_users.get('/author/:author', (req, res) => {
    const author = req.params.author.toLowerCase();
    let results = [];
    Object.values(books).forEach(book => {
        if (book.author.toLowerCase() === author) results.push(book);
    });

    if (results.length > 0) return res.status(200).json(results);
    return res.status(404).json({ message: "No books found for this author" });
});

// Task 4: Get books by title
public_users.get('/title/:title', (req, res) => {
    const title = req.params.title.toLowerCase();
    let results = [];
    Object.values(books).forEach(book => {
        if (book.title.toLowerCase() === title) results.push(book);
    });

    if (results.length > 0) return res.status(200).json(results);
    return res.status(404).json({ message: "No books found with this title" });
});

// Task 5: Get book reviews
public_users.get('/review/:isbn', (req, res) => {
    const isbn = req.params.isbn;
    if (books[isbn]) {
        return res.status(200).json(books[isbn].reviews);
    } else {
        return res.status(404).json({ message: "Book not found" });
    }
});

// Task 10: Get all books using async callback function
public_users.get('/asyncbooks', async (req, res) => {
    const getBooks = () => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(books);
            }, 1000);
        });
    };

    try {
        const bookList = await getBooks();
        return res.status(200).json(bookList);
    } catch (error) {
        return res.status(500).json({ message: "Error retrieving books" });
    }
});

// Task 11: Get book by ISBN using async/await
public_users.get('/async/isbn/:isbn', async (req, res) => {
    const isbn = req.params.isbn;

    const getBookByISBN = () => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (books[isbn]) resolve(books[isbn]);
                else reject("Book not found");
            }, 1000);
        });
    };

    try {
        const book = await getBookByISBN();
        return res.status(200).json(book);
    } catch (error) {
        return res.status(404).json({ message: error });
    }
});

// Task 12: Get books by author using async/await
public_users.get('/async/author/:author', async (req, res) => {
    const author = req.params.author.toLowerCase();

    const getBooksByAuthor = () => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                let results = Object.values(books).filter(book =>
                    book.author.toLowerCase() === author
                );

                if (results.length > 0) resolve(results);
                else reject("No books found for this author");
            }, 1000);
        });
    };

    try {
        const result = await getBooksByAuthor();
        return res.status(200).json(result);
    } catch (error) {
        return res.status(404).json({ message: error });
    }
});

// Task 13: Get books by title using async/await
public_users.get('/async/title/:title', async (req, res) => {
    const title = req.params.title.toLowerCase();

    const getBooksByTitle = () => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                let results = Object.values(books).filter(book =>
                    book.title.toLowerCase() === title
                );

                if (results.length > 0) resolve(results);
                else reject("No books found with this title");
            }, 1000);
        });
    };

    try {
        const result = await getBooksByTitle();
        return res.status(200).json(result);
    } catch (error) {
        return res.status(404).json({ message: error });
    }
});

module.exports.general = public_users;