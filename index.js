const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./mongodb/connect');
const auth = require('./routes/auth');

dotenv.config();

const app = express();

connectDB();

app.use(express.json());

app.use('/auth', auth);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});