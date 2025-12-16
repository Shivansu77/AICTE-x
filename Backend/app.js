require('dotenv').config();
const PORT = process.env.PORT || 8000;
const express = require('express');
const userRoutes = require('./src/routes/user-routes');
const cors = require('cors');
const connectDB = require('./appMongoose');

const app = express();

// Connect to MongoDB
connectDB();

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
    res.send('Hello, World!');
});
app.get('/home', (req, res) => {
    res.send('This is the home route');
});
app.use('/user', userRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
