const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const expressip = require('express-ip');
const cookieParser = require('cookie-parser');

const app = express();

require('dotenv').config();

app.use(expressLayouts);
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use('/', require('./routes/index.js'));

// Static content
app.use('/images', express.static(__dirname + '/images', { maxage: '3d' }));
app.use('/js', express.static(__dirname + '/js', { maxage: '3h' }));

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server started on port ${PORT} at ` + new Date().toString()));
