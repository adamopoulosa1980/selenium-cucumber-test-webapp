const express = require('express');
const multer = require('multer');
const path = require('path');
const app = express();
const port = 3000;

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

// Configure multer for file uploads
const upload = multer({ dest: 'uploads/' });

// Track cart count
let cartCount = 0;

// Login Page
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    // Supports both hardcoded user and CSV data from login_multi_users
    const validUsers = [
        { username: 'testuser@example.com', password: 'Password123' },
        { username: 'user1@example.com', password: 'Pass123' },
        { username: 'user2@example.com', password: 'Pass456' }
    ];
    const isValid = validUsers.some(user => user.username === username && user.password === password);
    if (isValid) {
        res.redirect('/dashboard'); // Matches user_journey expectation
    } else {
        res.send(`
            <!DOCTYPE html>
            <html>
            <head><title>Login</title></head>
            <body>
                <h1>Login</h1>
                <form method="post" action="/login">
                    <label for="username">Username:</label>
                    <input type="text" id="username" name="username" value="${username || ''}"><br/>
                    <label for="password">Password:</label>
                    <input type="password" id="password" name="password"><br/>
                    <button type="submit" id="loginButton">Login</button>
                </form>
                <div id="errorMessage">Invalid credentials</div>
                <a href="/cart" id="navToCart">Go to Cart</a>
            </body>
            </html>
        `);
    }
});

// Dashboard (redirects to cart as per test suite)
app.get('/dashboard', (req, res) => {
    res.redirect('/cart');
});

// Cart Page
app.get('/cart', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'cart.html'));
});

app.post('/cart/add', (req, res) => {
    cartCount++;
    res.send(`
        <!DOCTYPE html>
        <html>
        <head><title>Cart</title></head>
        <body>
            <h1>Cart</h1>
            <div id="cartCount">${cartCount}</div>
            <form method="post" action="/cart/add">
                <button type="submit" id="addToCart">Add to Cart</button>
            </form>
            <a href="/checkout" id="navToCheckout">Proceed to Checkout</a>
        </body>
        </html>
    `);
});

// Upload Page
app.get('/upload', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'upload.html'));
});

app.post('/upload', upload.fields([{ name: 'jsonUpload' }, { name: 'pdfUpload' }]), (req, res) => {
    const jsonFile = req.files['jsonUpload'] ? req.files['jsonUpload'][0] : null;
    const pdfFile = req.files['pdfUpload'] ? req.files['pdfUpload'][0] : null;

    if (jsonFile || pdfFile) {
        res.send(`
            <!DOCTYPE html>
            <html>
            <head><title>Upload</title></head>
            <body>
                <h1>File Upload</h1>
                <form method="post" enctype="multipart/form-data">
                    <label for="jsonUpload">Upload JSON:</label>
                    <input type="file" id="jsonUpload" name="jsonUpload" accept=".json"><br/>
                    <label for="pdfUpload">Upload PDF:</label>
                    <input type="file" id="pdfUpload" name="pdfUpload" accept=".pdf"><br/>
                    <button type="submit" id="submitButton">Upload</button>
                </form>
                <div id="successMessage">File uploaded successfully!</div>
            </body>
            </html>
        `);
    } else {
        res.send(`
            <!DOCTYPE html>
            <html>
            <head><title>Upload</title></head>
            <body>
                <h1>File Upload</h1>
                <form method="post" enctype="multipart/form-data">
                    <label for="jsonUpload">Upload JSON:</label>
                    <input type="file" id="jsonUpload" name="jsonUpload" accept=".json"><br/>
                    <label for="pdfUpload">Upload PDF:</label>
                    <input type="file" id="pdfUpload" name="pdfUpload" accept=".pdf"><br/>
                    <button type="submit" id="submitButton">Upload</button>
                </form>
                <div id="errorMessage">No file uploaded</div>
            </body>
            </html>
        `);
    }
});

// Checkout Page (for order_processing)
app.get('/checkout', (req, res) => {
    res.send('<h1>Checkout</h1>');
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});