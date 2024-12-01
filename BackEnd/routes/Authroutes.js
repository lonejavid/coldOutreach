const express = require('express');
const router = express.Router();
const authRoutes = require('../controllers/AuthController');

// Route to handle user sign-up
router.post('/signup', authRoutes.SignUp);

// Route to handle user login
router.post('/login', authRoutes.Login);

module.exports = router;



// const express = require('express');
// const router = express.Router();
// const authRoutes=require('../controllers/AuthController');
// router.post('/signup',authRoutes.SignUp);
// router.post('/login',authRoutes.Login);

// module.exports = router;
