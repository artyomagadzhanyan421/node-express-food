const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const app = express();
const auth = require('./routes/auth');

app.use(express.json());

app.use('/auth', auth);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});