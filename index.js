const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./mongodb/connect');
const auth = require('./routes/auth');
const recipes = require('./routes/recipes');

dotenv.config();

const app = express();

connectDB();

app.use(cors());

app.use(express.json());

app.use('/auth', auth);
app.use('/recipes', recipes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});