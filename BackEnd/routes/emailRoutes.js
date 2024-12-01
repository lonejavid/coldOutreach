const express = require('express');
const multer = require('multer');
// You might want to store files in a cloud storage like AWS S3 instead of local uploads directory
const upload = multer({ dest: '/tmp/uploads/' }); // Temporary directory for serverless functions, consider cloud storage
const router = express.Router();
const { registerMail, getRegisteredEmails, removeEmail } = require('../controllers/emailController');
const customEmailController = require('../controllers/customEmail');
const sendMails = require('../controllers/sendMails');
const userauthentication = require('../Middleware/Auth');
const AiChat = require('../controllers/AiChat');
//const getProfile = require('../controllers/getProfile')
const getCompanyDetiles = require('../controllers/getCompanyDetiles');
const removeCompany = require('../controllers/removeCompany');
// Route to register an email
const { launchEmailcompaign, emailPreview, getProgress } = require('../controllers/launchEmailcompaign');
const companydetails = require('../controllers/companydetails');

// API Routes
router.post('/registerMail', userauthentication.authenticate, registerMail);
router.get('/registeredEmails', userauthentication.authenticate, getRegisteredEmails);
router.delete('/removeEmail', userauthentication.authenticate, removeEmail);
router.post('/AiChat', userauthentication.authenticate, AiChat);
router.post('/sendMailCustom', userauthentication.authenticate, upload.single('file'), customEmailController);
router.post('/companydetails', userauthentication.authenticate, companydetails);
router.get('/getCompanyDetiles', userauthentication.authenticate, getCompanyDetiles);
router.post('/launchEmailcompaign', upload.single('file'), userauthentication.authenticate, launchEmailcompaign);
router.delete('/removeCompany', userauthentication.authenticate, removeCompany);
router.get('/emailPreview', emailPreview);
router.get('/getProgress', getProgress);

module.exports = router;


// // routes/emailRoutes.js
// const express = require('express');
// const multer = require('multer');
// const upload = multer({ dest: 'uploads/' });
// const router = express.Router();
// const { registerMail, getRegisteredEmails,removeEmail} = require('../controllers/emailController');
// const customEmailController=require('../controllers/customEmail')
// const sendMails=require('../controllers/sendMails');
// const userauthentication=require('../Middleware/Auth');
// const AiChat = require('../controllers/AiChat');
// //const getProfile=require('../controllers/getProfile')
// const getCompanyDetiles=require('../controllers/getCompanyDetiles');
// const removeCompany=require('../controllers/removeCompany');
// // Route to register an email
// const {launchEmailcompaign,emailPreview,getProgress}=require('../controllers/launchEmailcompaign');
// const companydetails=require('../controllers/companydetails');
// router.post('/registerMail', userauthentication.authenticate,registerMail);

// // Route to get all registered emails for a user
// router.get('/registeredEmails',userauthentication.authenticate, getRegisteredEmails);
// //router.post("/sendMails", userauthentication.authenticate, upload.single('file'), sendMails);
// router.delete("/removeEmail", userauthentication.authenticate, removeEmail);
// router.post("/AiChat", userauthentication.authenticate, AiChat);
// router.post("/sendMailCustom", userauthentication.authenticate, upload.single('file'), customEmailController);
// //router.get('/getProfile',userauthentication.authenticate,getProfile);
// router.post("/companydetails", userauthentication.authenticate, companydetails);
// router.get('/getCompanyDetiles',userauthentication.authenticate,getCompanyDetiles);
// // router.post('/stop-campaign',userauthentication.authenticate,stop-campaign);
// // router.post('/resume-campaign',userauthentication.authenticate,resumecampaign);
// // router.post('/terminate-campaign',userauthentication.authenticate,terminatecampaign);
// router.post('/launchEmailcompaign',upload.single('file'),userauthentication.authenticate,launchEmailcompaign);
// router.delete('/removeCompany',userauthentication.authenticate,removeCompany);
// router.get('/emailPreview',emailPreview);
// router.get('/getProgress',getProgress)
// module.exports = router;
