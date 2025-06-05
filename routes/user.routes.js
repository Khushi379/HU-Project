const express = require('express');
const Router = express.Router();
const { body,validationResult } = require('express-validator');
const UserModel = require('../models/user.model');


const BookModel = require('../models/book.model'); 

// ...existing code...

Router.post('/api/books', async (req, res) => {
  try {
    const book = await BookModel.create(req.body);
    res.json({ message: "Book listed successfully!", book });
  } catch (err) {
    res.status(500).json({ error: "Failed to list book", details: err.message });
  }
});

Router.get('/register', (req, res) => {
  console.log(req.body);
  res.render("register");
});

Router.post('/register', [
  body('Email').isEmail().withMessage('Email is not valid'),
  body('Password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  // Handle registration logic here
  try {
    const { Email, Password } = req.body;
    const hashedPassword = await bcrypt.hash(Password, 10);
    const newUser = await UserModel.create({ Email, Password: hashedPassword });
    res.json({
      message: "User registered successfully",
      user: newUser
    });
  } catch (err) {
    res.status(500).json({ error: "Registration failed", details: err.message });
  }
});
    
Router.get('/login', (req, res) => {
  
  res.render("login");

  

});
Router.post('/login', [
  body('Email').isEmail().withMessage('Email is not valid'),
  body('Password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  // Show the submitted data on the screen
  res.send(`User logged in successfully.<br>Data received:<br><pre>${JSON.stringify(req.body, null, 2)}</pre>`);
});


// Delete book by ID
Router.post('/api/books/delete/:id', async (req, res) => {
  try {
    await BookModel.findByIdAndDelete(req.params.id);
    res.json({ message: "Book deleted successfully!" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete book", details: err.message });
  }
});


Router.get('/buy', async (req, res) => {
  try {
    const books = await BookModel.find();
    res.render("buy", { books });
  } catch (err) {
    res.status(500).send("Failed to load books");
    
  }
});
Router.get('/sell', (req, res) => {
  res.render("sell");
});

const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

Router.get('/api/google-books', async (req, res) => {
  const { title, author } = req.query;
  const apiKey = 'AIzaSyD097p1UWqmBnCBUtBJugOkNjcdhzXb_6Q';

  let q = '';
  if (title) q += `intitle:${title}`;
  if (author) q += (q ? '+' : '') + `inauthor:${author}`;

  // If q is empty, return an error
  if (!q) {
    return res.status(400).json({ error: 'Please provide a title or author to search.' });
  }

  const url = `https://www.googleapis.com/books/v1/volumes?q=${q}&key=${apiKey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    if (data.error) {
      // Log the error from Google Books API
      console.error('Google Books API error:', data.error);
      return res.status(500).json({ error: 'Google Books API error', details: data.error });
    }
    res.json(data.items || []);
  } catch (err) {
    console.error('Google Books API error:', err);
    res.status(500).json({ error: 'Failed to fetch from Google Books', details: err.message });
  }
});
Router.post('/api/save-google-book', async (req, res) => {
  try {
    // Expecting book data in req.body
    const { title, author, price, imageUrl, description } = req.body;
    const newBook = await BookModel.create({ title, author, price, imageUrl, description });
    res.json({ message: "Book saved to database!", book: newBook });
  } catch (err) {
   
    console.error('Google Books API error:', err); 
    res.status(500).json({ error: "Failed to save book", details: err.message });
  }
});



module.exports = Router;
