import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const SetUpEmail = ({ emailSubject, emailBody, companyDetails  }) => {
  console.log("users entered company details are",companyDetails)
  const [email, setEmail] = useState("");
  const [appPassword, setAppPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [registeredEmails, setRegisteredEmails] = useState([]);
  const [selectedEmails, setSelectedEmails] = useState([]);
  const [showEmailList, setShowEmailList] = useState(false);
  const navigate = useNavigate();

  const handleEmailChange = (e) => setEmail(e.target.value);
  const handleAppPasswordChange = (e) => setAppPassword(e.target.value);

  // Handle email registration
  const handleSubmit = async () => {
    if (!email || !appPassword) {
      setMessage("Please enter both email and app password.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "https://emailmarketing-7bf5d90cb8a1.herokuapp.com/registerMail",
        { email, appPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 200) {
        setMessage("Verification successful! Now, choose a registered email.");
        fetchRegisteredEmails();
      } else {
        setMessage("Error in verification. Please check your details.");
      }
    } catch (error) {
      setMessage("Network error: Unable to verify.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch registered emails
  const fetchRegisteredEmails = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("https://emailmarketing-7bf5d90cb8a1.herokuapp.com/registeredEmails", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRegisteredEmails(response.data.registeredEmails);
      setShowEmailList(true);  // Show the email list after fetching
    } catch (error) {
      setMessage("Error fetching registered emails.");
    }
  };

  // Handles email selection
  const handleEmailSelect = (email) => {
    setSelectedEmails((prevSelectedEmails) => {
      if (prevSelectedEmails.includes(email)) {
        return prevSelectedEmails.filter((e) => e !== email);
      } else {
        return [...prevSelectedEmails, email];
      }
    });
  };

  // Handles email removal
  const handleRemoveEmail = async (email) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.delete("https://emailmarketing-7bf5d90cb8a1.herokuapp.com/removeEmail", {
        headers: { Authorization: `Bearer ${token}` },
        data: { email },
      });

      if (response.status === 200) {
        setRegisteredEmails(registeredEmails.filter((regEmail) => regEmail.email !== email));
        setMessage(`Email ${email} has been removed.`);
      } else {
        setMessage("Error removing email.");
      }
    } catch (error) {
      setMessage("Network error: Unable to remove email.");
    }
  };

  // Handle "Done" action
  const handleDone = () => {
    if (selectedEmails.length > 0) {
      console.log("comapany deaasae",companyDetails)
      const encodedEmails = encodeURIComponent(JSON.stringify(selectedEmails));
      const encodedCompanyDetails = encodeURIComponent(companyDetails);
      console.log("my company details are ",encodedCompanyDetails)
  
      // Navigate to the /add-file route with both emails and companyDetails in the query parameters
      navigate(`/add-file?emails=${encodedEmails}&companyDetails=${encodedCompanyDetails}`);
    } else {
      setMessage("Please select at least one email.");
    }
  };
  

  // Handle cancel
  const handleCancel = () => {
    setShowEmailList(false);
    setSelectedEmails([]);
  };

  // New logic to determine if custom template is provided
  const shouldUseCustomTemplate = emailSubject && emailBody;

  // Send mail or navigate to email selection
  const handleNext = () => {
    if (shouldUseCustomTemplate) {
      axios.post("https://emailmarketing-7bf5d90cb8a1.herokuapp.com/customTemplate", { emailSubject, emailBody })
        .then(response => {
          setMessage("Custom template email sent successfully.");
        })
        .catch(error => {
          setMessage("Error sending custom template email.");
        });
    } else {
      handleDone();  // Proceed with the usual flow if no custom template is provided
    }
  };

  return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      padding: "20px",
      minHeight: "100vh",
      backgroundColor: "#121212",
      color: "white",
      flexDirection: "column",
      textAlign: "center",
      boxSizing: "border-box",
    }}>
      <style>
        {`
          @media (max-width: 768px) {
            h2 { font-size: 18px; }
            p { font-size: 13px; }
            input, button { font-size: 14px; }
          }
          @media (max-width: 480px) {
            h2 { font-size: 16px; }
            p { font-size: 12px; }
            input, button { font-size: 13px; }
          }
        `}
      </style>

      <div style={{
        maxWidth: "600px",
        padding: "30px",
        backgroundColor: "#1e1e1e",
        borderRadius: "10px",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.5)",
        width: "100%",
      }}>
        <h2>Email Setup Instructions</h2>
        <p style={{ color: "#b0b0b0", fontSize: "14px", lineHeight: "1.8", marginBottom: "20px" }}>
  To set up your email for campaign sending, follow these steps:
  <br />
  <span style={{ display: "block", marginLeft: "20px" }}>1. Enable two-step verification.</span>
  <span style={{ display: "block", marginLeft: "20px" }}>2. Go to your security settings.</span>
  <span style={{ display: "block", marginLeft: "20px" }}>3. Search for "App passwords."</span>
  <span style={{ display: "block", marginLeft: "20px" }}>4. Create a new app password with the name "Email marketing."</span>
  <span style={{ display: "block", marginLeft: "20px" }}>5. Paste the 16-character code here.</span>
  <br />
  <span style={{ display: "block", marginTop: "10px", fontStyle: "italic" }}>Your privacy is our top priority.</span>
</p>


        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={handleEmailChange}
          style={{
            padding: "10px",
            width: "100%",
            borderRadius: "5px",
            marginBottom: "15px",
            border: "1px solid #555",
            backgroundColor: "#333",
            color: "white",
            boxSizing: "border-box",
          }}
        />
        <input
          type="password"
          placeholder="Enter app password"
          value={appPassword}
          onChange={handleAppPasswordChange}
          style={{
            padding: "10px",
            width: "100%",
            borderRadius: "5px",
            marginBottom: "20px",
            border: "1px solid #555",
            backgroundColor: "#333",
            color: "white",
            boxSizing: "border-box",
          }}
        />
        <button
          onClick={handleSubmit}
          style={{
            padding: "12px",
            width: "100%",
            backgroundColor: loading ? "gray" : "#4CAF50",
            color: "white",
            borderRadius: "5px",
            border: "none",
            cursor: loading ? "not-allowed" : "pointer",
            boxSizing: "border-box",
          }}
          disabled={loading}
        >
          {loading ? "Processing..." : "Authenticate"}
        </button>

        {!showEmailList && (
          <button
            onClick={fetchRegisteredEmails}
            style={{
              padding: "12px",
              width: "100%",
              backgroundColor: "#2196F3",
              color: "white",
              borderRadius: "5px",
              border: "none",
              marginTop: "15px",
              cursor: "pointer",
            }}
          >
            View Registered Emails
          </button>
        )}

        {showEmailList && (
          <div style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "#1e1e1e",
            borderRadius: "10px",
            padding: "20px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.5)",
            zIndex: 1000,
          }}>
            <h4>Select Registered Emails</h4>
            <ul style={{ listStyle: "none", padding: 0 }}>
              {registeredEmails.map((regEmail) => (
                <li key={regEmail._id} style={{ marginBottom: "10px" }}>
                  <input
                    type="checkbox"
                    name="selectedEmail"
                    value={regEmail.email}
                    checked={selectedEmails.includes(regEmail.email)}
                    onChange={() => handleEmailSelect(regEmail.email)}
                    style={{ marginRight: "8px" }}
                  />
                  {regEmail.email}
                  <button
                    onClick={() => handleRemoveEmail(regEmail.email)}
                    style={{
                      backgroundColor: "#FF6347",
                      color: "white",
                      borderRadius: "5px",
                      padding: "5px 10px",
                      marginLeft: "10px",
                      cursor: "pointer",
                    }}
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <button
                onClick={handleCancel}
                style={{
                  padding: "8px 16px",
                  backgroundColor: "#f44336",
                  color: "white",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleNext}
                style={{
                  padding: "8px 16px",
                  backgroundColor: "#4CAF50",
                  color: "white",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              >
                Done
              </button>
            </div>
          </div>
        )}

        {message && <p style={{ marginTop: "20px", color: "#FF5722" }}>{message}</p>}
      </div>
    </div>
  );
};

export default SetUpEmail;
