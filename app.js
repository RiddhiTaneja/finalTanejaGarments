// const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const hbs = require('hbs');
const session = require('express-session');
const MongoStore = require('connect-mongo');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Ensure required environment variables are set
if (!process.env.SESSION_SECRET || !process.env.CLOUDMONGOOSE_URL || !process.env.PORT) {
    console.error('Missing environment variables. Please check your .env file.');
    process.exit(1);
}

// MongoDB connection
mongoose.connect(process.env.CLOUDMONGOOSE_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Connected to MongoDB');
        app.listen(PORT, () => {
            console.log(`Server running at http://localhost:${PORT}`);
        });
    })
    .catch(err => {
        console.error('MongoDB connection error:', err);
    });

// Session configuration
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({ mongoUrl: process.env.CLOUDMONGOOSE_URL })
}));

// Passport configuration
const passport = require('./authentication/passport');
app.use(passport.initialize());
app.use(passport.session());

// Setting up Handlebars as the view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
hbs.registerPartials(path.join(__dirname, 'views/partials'));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Routes
const homeRouter = require('./routes/home');
app.use('/', homeRouter);

const adminRouter = require('./routes/admin');
const { isAdmin } = require('./middlewares/isAdmin');
app.use('/admin', isAdmin, adminRouter);

const shopRouter = require('./routes/shop');
const { isLoggedIn } = require('./middlewares/isLoggedIn');
app.use('/shop', isLoggedIn, shopRouter);

// Exporting app
module.exports = app;

// Debugging - Uncomment to log environment variables
// console.log('Google Client ID:', process.env.GOOGLE_CLIENTID);
// console.log('Google Client Secret:', process.env.GOOGLE_CLIENT_SECRET);
