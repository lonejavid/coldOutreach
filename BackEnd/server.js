// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const bodyParser = require('body-parser');
const emailRoutes = require('./routes/emailRoutes'); // Import email routes
const authRoutes=require('./routes/Authroutes')

const connectDB = require('./config/db'); // Import the DB connection

// Initialize the Express app
const app = express();
const port = process.env.PORT || 3000;


// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Connect to MongoDB
connectDB();

// Use the email routes for handling emails
app.use(emailRoutes); // All routes in emailRoutes.js will be prefixed with '/api/email'
app.use(authRoutes);

// Start the server
// Serve the React frontend in production
if (process.env.NODE_ENV === 'production') {
  // Set static folder to the client build folder
  app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
  app.use(express.static(path.join(__dirname, 'client', 'build')));

  // Serve the frontend
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
  });
}
app.get('/get-photo', (req, res) => {
  const { photoName } = req.query; // Get the photo name from query parameters
  console.log("photo name is",photoName)
  const cleanedPhotoName = photoName.replace(/^uploads[\\/]/, ''); // Remove "uploads/" or "uploads\"
console.log('Cleaned photo name is', cleanedPhotoName);

  // Validate the photo name
  if (!photoName) {
    return res.status(400).json({ message: 'Photo name is required' });
  }

  // Construct the file path to the image

  const photoPath = path.join(__dirname, 'uploads', cleanedPhotoName);

  // Check if the file exists
  
fs.access(photoPath, fs.constants.F_OK, (err) => {
  if (err) {
      console.log('Photo not found:', err);
      return res.status(404).json({ message: 'Photo not found' });
  }

  // Send the photo as a response
  console.log('Photo path is:', photoPath);
  res.sendFile(photoPath);
});
});
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
