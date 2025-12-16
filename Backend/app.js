require('dotenv').config();
const PORT = process.env.PORT || 8000;
const express = require('express');
const userRoutes = require('./src/routes/user-routes');
const cors = require('cors');
const connectDB = require('./appMongoose');

const app = express();

// Connect to MongoDB
connectDB();

// Manual CORS middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:5173');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
app.use(express.json());

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
