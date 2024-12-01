import React, { useEffect, useState } from 'react';
import axios from 'axios';
import CompanyConfig from './CompanyConfig';
import SetUpEmail from './setUpEmail';
import AiDashboard from './AiDashbaord';

const SetUpDetails = () => {
  const [companyDetails, setCompanyDetails] = useState([]);
  const [registeredEmails, setRegisteredEmails] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [selectedEmails, setSelectedEmails] = useState([]);
  const [excelFile, setExcelFile] = useState(null);
  const [currentView, setCurrentView] = useState('main');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [showDashboard, setShowDashboard] = useState(false); // Added state to manage dashboard rendering

  // Fetch data on component load
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setMessage('Authentication token not found. Please log in again.');
      return;
    }

    const fetchData = async () => {
      try {
        const [companyRes, emailRes] = await Promise.all([
          axios.get('https://emailmarketing-7bf5d90cb8a1.herokuapp.com/getCompanyDetiles', {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get('https://emailmarketing-7bf5d90cb8a1.herokuapp.com/registeredEmails', {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const extractedEmails = emailRes.data.registeredEmails.map(emailObj => emailObj.email);
        setCompanyDetails(companyRes.data || []);
        setRegisteredEmails(extractedEmails || []);
      } catch (error) {
        setMessage('Error fetching data from the server.');
      }
    };

    fetchData();
  }, []);

  // Handle file change
  const handleFileChange = (e) => {
    setExcelFile(e.target.files[0]);
  };

  // Handle campaign launch
  const handleLaunchCampaign = async () => {
    if (!selectedCompany || selectedEmails.length === 0 || !excelFile) {
      setMessage('Please provide all required details.');
      return;
    }

    const formData = new FormData();
    formData.append('company', JSON.stringify(selectedCompany));
    formData.append('emails', JSON.stringify(selectedEmails));
    formData.append('file', excelFile);

    const token = localStorage.getItem('token');
    if (!token) {
      setMessage('Authentication token not found. Please log in again.');
      return;
    }

    try {
      setIsLoading(true);
      const response = await axios.post('https://emailmarketing-7bf5d90cb8a1.herokuapp.com/launchEmailcompaign', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      setMessage(response.data.message || 'Campaign launched successfully!');
     setTimeout(()=>{
      setShowDashboard(true);

     },3000)  // Show the dashboard when the campaign is successfully launched
    } catch (error) {
      setMessage('Error launching campaign.');
    } finally {
      setIsLoading(false);
    }
  };

  // Render conditional components
  if (showDashboard) {
    return <AiDashboard />;
  }

  if (currentView === 'companyConfig') {
    return <CompanyConfig onBack={() => setCurrentView('main')} />;
  }

  if (currentView === 'emailConfig') {
    return <SetUpEmail onBack={() => setCurrentView('main')} />;
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Launch Your Campaign</h1>

      <div style={styles.section}>
        {/* Company Details */}
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Company Details</h3>
          {companyDetails.length > 0 ? (
            companyDetails.map((company) => (
              <label key={company.id} style={styles.radioLabel}>
                <input
                  type="radio"
                  name="company"
                  value={company.id}
                  onChange={() => setSelectedCompany(company)}
                  style={styles.radioInput}
                />
                {company.name}
              </label>
            ))
          ) : (
            <p style={styles.infoText}>No company details found.</p>
          )}
          <button style={styles.button} onClick={() => setCurrentView('companyConfig')}>
            Configure New Company
          </button>
        </div>

        {/* Registered Emails */}
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Source Email IDs</h3>
          {registeredEmails.length > 0 ? (
            registeredEmails.map((email, index) => (
              <label key={index} style={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  value={email}
                  onChange={(e) =>
                    setSelectedEmails((prev) =>
                      e.target.checked ? [...prev, email] : prev.filter((em) => em !== email)
                    )
                  }
                  style={styles.checkboxInput}
                />
                {email}
              </label>
            ))
          ) : (
            <p style={styles.infoText}>No registered emails found.</p>
          )}
          <button style={styles.button} onClick={() => setCurrentView('emailConfig')}>
            Configure New Email
          </button>
        </div>

        {/* Excel File Upload */}
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Upload Excel File</h3>
          <input type="file" accept=".xlsx, .xls" onChange={handleFileChange} style={styles.fileInput} />
        </div>
      </div>

      <button onClick={handleLaunchCampaign} style={styles.launchButton} disabled={isLoading}>
        {isLoading ? 'Launching...' : 'Launch Campaign'}
      </button>
      {message && <p style={styles.message}>{message}</p>}
    </div>
  );
};

const styles = {
  container: {
    backgroundColor: '#000',
    color: '#fff',
    minHeight: '100vh',
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
  },
  title: {
    textAlign: 'center',
    marginBottom: '30px',
  },
  section: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '20px',
    justifyContent: 'center',
  },
  card: {
    backgroundColor: '#1a1a1a',
    padding: '20px',
    borderRadius: '10px',
    width: '30%',
    boxShadow: '0px 4px 6px rgba(255, 255, 255, 0.1)',
  },
  cardTitle: {
    marginBottom: '15px',
  },
  radioLabel: {
    display: 'block',
    marginBottom: '10px',
  },
  radioInput: {
    marginRight: '10px',
  },
  checkboxLabel: {
    display: 'block',
    marginBottom: '10px',
  },
  checkboxInput: {
    marginRight: '10px',
  },
  infoText: {
    fontSize: '14px',
    color: '#ccc',
  },
  button: {
    marginTop: '10px',
    padding: '10px 15px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  fileInput: {
    width: '100%',
    padding: '10px',
    borderRadius: '5px',
    backgroundColor: '#333',
    border: '1px solid #444',
    color: '#fff',
  },
  launchButton: {
    marginTop: '30px',
    padding: '15px 30px',
    backgroundColor: '#28a745',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    display: 'block',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  message: {
    marginTop: '20px',
    textAlign: 'center',
    color: '#ffcc00',
  },
};

export default SetUpDetails;
