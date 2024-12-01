const Email = require("../Modals/Email");
const User = require("../Modals/user");

exports.registerMail = async (req, res) => {
  try {
    var { email, appPassword } = req.body;
    const userId = req.user.id; // Assuming `req.user` contains the authenticated user info
    console.log("Authenticated user ID is:", userId);
     appPassword = appPassword.replace(/\s+/g, '');

    // Validate input
    if (!email || !appPassword) {
      return res.status(400).json({ message: "Email and app password are required." });
    }

    // Check if the email already exists for the user
    const existingEmail = await Email.findOne({ userId, email });
    if (existingEmail) {
      return res.status(400).json({ message: "This email is already registered." });
    }

    // Create and save the new email
    const newEmail = new Email({ userId, email, appPassword });
    await newEmail.save();

    // Update the user to include this new email reference
    await User.findByIdAndUpdate(userId, { $push: { registeredEmails: newEmail._id } });

    res.status(200).json({ message: "Email registered successfully!" });
  } catch (error) {
    console.error("Error registering email:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

exports.getRegisteredEmails = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming `req.user` contains the authenticated user info

    // Populate the user's registered emails
    
    const user = await User.findById(userId).populate('registeredEmails');

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    res.status(200).json({ registeredEmails: user.registeredEmails });
  } catch (error) {
    console.error("Error fetching registered emails:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

// Remove an email
exports.removeEmail = async (req, res) => {
  try {
    const { email } = req.body;
    const userId = req.user.id; // Assuming `req.user` contains the authenticated user info

    // Validate input
    if (!email) {
      return res.status(400).json({ message: "Email is required to remove." });
    }

    // Find the email to be removed in the Email collection
    const emailDoc = await Email.findOne({ userId, email });
    if (!emailDoc) {
      return res.status(404).json({ message: "Email not found." });
    }

    // Remove the email document from the Email collection
    await Email.findByIdAndDelete(emailDoc._id);

    // Remove the email reference from the user's registeredEmails array
    await User.findByIdAndUpdate(userId, {
      $pull: { registeredEmails: emailDoc._id }
    });

    res.status(200).json({ message: "Email removed successfully." });
  } catch (error) {
    console.error("Error removing email:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};
