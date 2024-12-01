const fs = require("fs");
const xlsx = require("xlsx");
const CompanyDetails = require('../Modals/CompanyDetails');
const Email = require('../Modals/Email');
const nodemailer = require("nodemailer");
const Groq = require('groq-sdk');
const groq = new Groq({ apiKey: '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' });
var emailsub='';
var emailbod='';
var count=0;
var totalcount=0;

// Delay function to pause for a specified time
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Function to generate email content from Groq
async function generateEmail(prompt) {
  try {
    const chatCompletion = await groq.chat.completions.create({
      "messages": [
        {
          "role": "user",
          "content": prompt,
        }
      ],
      "model": "llama3-70b-8192",
      "temperature": 0.7,
      "max_tokens": 300,
      "top_p": 1,
      "stream": false,
      "stop": null
    });

    const emailContent = chatCompletion.choices[0]?.message?.content || chatCompletion.choices[0]?.text || '';

    if (!emailContent) {
      return { subject: '', body: 'No content generated' };
    }

    const subjectMatch = emailContent.match(/startSubject\s*(.*?)\s*endSubject/);
    const bodyMatch = emailContent.match(/startBody([\s\S]*?)endBody/);

    const subject = subjectMatch ? subjectMatch[1].trim() : '';
    const body = bodyMatch ? bodyMatch[1].trim() : 'No body content generated';
    

    return { subject, body };
  } catch (error) {
    console.error('Error fetching Groq response:', error);
    return { subject: 'Error', body: 'Error generating email' };
  }
}

const launchEmailcompaign = async (req, res) => {
  try {
    // Parse company details and emails from the request body
    let { company, emails } = req.body;
    
    company = JSON.parse(company); 
    const emailArray = JSON.parse(emails);

    // Fetch company details from the database
    const companyDetails = await CompanyDetails.findOne({
      userId: req.user._id,
      name: company.name
    });

    if (!companyDetails) {
      return res.status(400).json({ message: "Company details not found." });
    }

    // Validate file upload
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded." });
    }

    const filePath = req.file.path;
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const sheetData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

    // Find the registered emails from the database based on the user's selection
    const registeredEmails = await Email.find({
      userId: req.user._id,
      email: { $in: emailArray }
    });

    if (registeredEmails.length === 0) {
      return res.status(400).json({ message: "No valid registered emails found." });
    }

    // Send initial email that campaign has started
    const initialEmail = registeredEmails[0].email;  // Send to the first source email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "ewq84033@gmail.com",
        pass: "rnzqrgmjdluiglqc",
      },
    });

    await transporter.sendMail({
      from: "ewq84033@gmail.com",
      to: initialEmail,
      subject: "Email Campaign Started",
      text: "Your email campaign has started successfully. We will notify you when it's completed.",
    });

    // Immediately respond to the frontend that the campaign has started
    res.status(200).json({ message: "Email campaign started successfully." });

    // Process the email sending queue asynchronously in the background
    let emailIndex = 0;
    const emailQueue = sheetData.map(row => row.email).filter(validateEmail);
    totalcount=emailQueue.length;


    for (let i = 0; i < emailQueue.length; i++) {
      const recipientEmail = emailQueue[i];
      const currentSourceEmail = registeredEmails[emailIndex].email;
      const appPassword = registeredEmails[emailIndex].appPassword;

      // Construct the Groq prompt to generate the email
      const prompt = `
      These are the details of my company name= ${companyDetails.name}: and details are ${companyDetails.details}. Please carefully read and understand the services my company offers.
      Next, look at this email address: ${recipientEmail}. Identify the domain name, research the company behind it, and then compose an email suggesting how our company can help them grow their business.

      If the domain is a Gmail address (gmail.com), compose a simple email asking about their thoughts on our company and the services we provide.

      Please structure the response with the following format:
      - **Subject:** The subject line of the email.
      - **Body:** The body content of the email.

      Your response should be structured as follows:

      startSubject
      [Your Subject Here]
      endSubject

      startBody
      [Your Email Body Here]
      endBody

      in this place [Your Name] do have Outreach Team with no braces. Please only return the subject and the body in this specific format. Do not include any other information or explanations.
      `;

      // Generate the subject and body using Groq
      const { subject, body } = await generateEmail(prompt);
      emailsub=subject;
    emailbod=body;
    count++;
  

      // Set up Nodemailer transporter for sending email
      const emailTransporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: currentSourceEmail,
          pass: appPassword,
        },
      });

      // Send the email to the recipient
      await emailTransporter.sendMail({
        from: currentSourceEmail,
        to: recipientEmail,
        subject,
        text: body,
      });

      // Delay before sending the next email
      await delay(3000);

      // Cycle through the source emails
      emailIndex = (emailIndex + 1) % registeredEmails.length;
    }

    // Send final email that campaign is completed
    await transporter.sendMail({
      from: "ewq84033@gmail.com",
      to: initialEmail,
      subject: "Email Campaign Completed",
      text: "Your email campaign has been completed successfully. Have a nice time ahead!",
    });

    // Clean up the uploaded file
    fs.unlinkSync(filePath);

  } catch (error) {
    console.error("Error in launching email campaign:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

// Simple email validation function
const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};
const emailPreview = async (req, res) => {
    
    return res.status(200).json({ subject: emailsub, body: emailbod});
}
const getProgress = async (req, res) => {
    // Ensure count and totalcount are available
    if (!count || !totalcount || totalcount === 0) {
        return res.status(400).json({ error: 'Invalid count or totalcount' });
    }

    // Correct percentage calculation
    var percent = (count / totalcount) * 100;

    // Log the values for debugging
    console.log("Total emails are", totalcount);
    console.log("New count is", count);
    console.log("Progress is", percent);

    return res.status(200).json({ percent: percent });
}

module.exports = {launchEmailcompaign,emailPreview,getProgress};
