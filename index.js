const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./mongodb/connect');

const auth = require('./routes/auth');
const recipes = require('./routes/recipes');
const rate = require("./routes/rate");
const book = require("./routes/book");
const operation = require("./routes/operation");

dotenv.config();

const app = express();

connectDB();

app.use(cors());

app.use(express.json());

app.use('/auth', auth);
app.use('/recipes', recipes);
app.use('/rate', rate);
app.use('/book', book);
app.use('/operation', operation);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});