require('dotenv').config();
const express = require('express');
const connectDB = require('./appMongoose');

// Connect to Database
connectDB();
const cors = require('cors');
const userRoutes = require('./src/routes/user-routes');
const courseRoutes = require('./src/routes/course-routes');
const curriculumRoutes = require('./src/routes/curriculum-routes');
const announcementRoutes = require('./src/routes/announcement-routes');
const messageRoutes = require('./src/routes/message-routes');
const requestRoutes = require('./src/routes/request-routes');
const aiRoutes = require('./src/routes/ai-routes'); // Import AI routes
const settingsRoutes = require('./src/routes/settings-routes'); // Import Settings routes
const { initializeAiSettings } = require('./src/controllers/settings-controller');

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/user', userRoutes); // Alias for frontend singular usage
app.use('/api/courses', courseRoutes);
app.use('/api/curriculum', curriculumRoutes);
app.use('/api/announcement', announcementRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/ai', aiRoutes); // Use AI routes
app.use('/api/settings', settingsRoutes); // Use Settings routes

// Initialize AI settings from database
initializeAiSettings();

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
