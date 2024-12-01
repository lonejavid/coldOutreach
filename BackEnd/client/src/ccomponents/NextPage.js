import '../styles/next.css';
import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {  faBook, faDollarSign, faEnvelope, faCogs, faSignOutAlt,faTachometerAlt  } from '@fortawesome/free-solid-svg-icons';
import { Modal, Button, Card, Row, Col } from 'react-bootstrap';
import SetUpEmail from './setUpEmail';
import { useAuth } from '../ccomponents/contexts/AuthContext'; // Import the useAuth hook
import CustomTemplateForm from '../ccomponents/customtemplate';
import TaskDashboard from '../ccomponents/Dashboard';
import AiDashboard from '../ccomponents/AiDashbaord'
import SetUpEmailCustom from '../ccomponents/SetupEmailCustom'
import SetUpDetails from '../ccomponents/SetUpDetails'
import CompanyConfig from '../ccomponents/CompanyConfig';

   
const Sidebar = () => {
  const { user } = useAuth();
  const [isActive,setIsActive]=useState(false);
  const [showButtons,setShowButtons]=useState(false);
  const [activeTab, setActiveTab] = useState('TaskCards');
  const [paid, setPaid] = useState(false);
  const [showFreeModal, setShowFreeModal] = useState(false);
  const [showPaidModal, setShowPaidModal] = useState(false);
  const [companyDetails, setCompanyDetails] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { logout } = useAuth(); // Use the logout function from context


  const getPhotoUrl = (photoName) => {
    return `https://emailmarketing-7bf5d90cb8a1.herokuapp.com/get-photo?photoName=${encodeURIComponent(photoName)}`;
  };
  
  // Example usage in the component
  const photoUrl = user.photo ? getPhotoUrl(user.photo) : 'https://via.placeholder.com/80'; // Placeholder if no photo
   


  

  const handleSubmit = (e) => {
    e.preventDefault();

    if (companyDetails.trim() === "") {
      alert("Please enter the specifications.");
      return;
    }

    setIsLoading(true);

    // Simulate the scraping/loading time
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
      alert("Web scraping completed!");
    }, 10); // Simulate a 3-second web scraping
  };

  // useEffect(() => {
  //   console.log("Paid state updated:", paid);
  // }, [paid]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setIsActive(!isActive);
    setTimeout(() => setIsActive(false), 500);
  };



  const handleTabChangeToAi = (tab) => {
    setActiveTab(tab);
  };

  // Handle modal visibility
  const handleCloseFreeModal = () => setShowFreeModal(false);
  const handleShowFreeModal = () => setShowFreeModal(true);

  const handlePaidModal = async () => {
    console.log("before paid ", paid);
    setPaid(true);
    setShowPaidModal(false);
  };

  const handleClosePaidModal = () => setShowPaidModal(false);
  const handleShowPaidModal = () => setShowPaidModal(true);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <TaskDashboard/>
        );
        case 'emailConfig':
          return (
            <SetUpEmailCustom/>
          );
          case 'companyConfig':
            return (
              <CompanyConfig/>
            )
        case 'custom-template':
        return (
          <div className="custom-template">
            <CustomTemplateForm />
          </div>
        );
      case 'documentation':
        return (
          <div className="documentation-section">
            <h1>Documentation</h1>
            <h2>Overview</h2>
            <p>
              Our company provides an email marketing service that allows businesses to effectively use email for marketing and lead generation. What makes our system unique is its capability to conduct research across the web, scraping the latest information to enhance email content. Our AI generates emails that are tailored to targeted users, making them feel personalized and relevant.
            </p>
            <h2>How the System Works</h2>
            <ol>
              <li><strong>Upload Recipient List:</strong> Users can upload an Excel file containing email addresses of their desired recipients.</li>
              <li><strong>Email Generation Options:</strong> Users can choose to generate emails using our AI or upload their own custom templates.</li>
              <li><strong>Dynamic Content Creation:</strong> Our AI leverages researched data to craft personalized emails that impress recipients.</li>
            </ol>
            <h2>Pricing Plans</h2>
            <h3>Free Plan</h3>
            <p>
              - **Cost:** Free<br/>
              - **Limit:** Send up to 10 emails per day for 10 days.<br/>
              - **Features:** No AI assistance or research.
            </p>
            <h3>Paid Plan</h3>
            <p>
              - **Cost:** $300/month<br/>
              - **Features:** Unlimited emails, AI assistance, and research. Emails sent from your email address.
            </p>
            <h2>Setup for Paid Users</h2>
            <p>
              To send emails from your own email address, configure your settings to allow our server to send on your behalf.
            </p>
          </div>
        );
      case 'pricing':
        return (
          <div className="pricing-section">
            <h1>Pricing Plans</h1>
            <Row className="justify-content-center my-4">
              {/* Free Plan Card */}
              <Col md={4} className="mb-4 d-flex justify-content-center">
                <Card className="plan-card text-center" style={{ backgroundColor: 'black', color: 'white' }}>
                  <Card.Body>
                    <Card.Title className="plan-card-title">Free Plan</Card.Title>
                    <Card.Text>
                      Basic features at no cost, ideal for small campaigns and trials.
                    </Card.Text>
                    <Button variant="info" onClick={handleShowFreeModal}>
                      Free Plan
                    </Button>
                  </Card.Body>
                </Card>
              </Col>

              {/* Paid Plan Card */}
              <Col md={4} className="mb-4 d-flex justify-content-center">
                <Card className="plan-card text-center" style={{ backgroundColor: 'black', color: 'white' }}>
                  <Card.Body>
                    <Card.Title className="plan-card-title">Paid Plan</Card.Title>
                    <Card.Text>
                      Premium features for $300/month, designed for businesses with larger needs.
                    </Card.Text>
                    <Button variant="success" onClick={handleShowPaidModal}>
                      Paid Plan
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </div>
        );
      case 'email-ai':
        return (
          <SetUpDetails/>
         
        );
        case 'email-custom':
          return (
            <CustomTemplateForm/>
           
          );
      default:
        return <AiDashboard/>;
    }
  };

  // Handle logout
  const handleLogout = () => {
    logout(); // Call the logout function from the context
    window.location.href = '/'; // Redirect to the homepage or login page after logout
  };



  return (
    <div className="container-fluid">
      <div className="row">
      <div
  className="col-4 bg-dark vh-100 d-flex flex-column justify-content-between p-3 text-white position-fixed"
  style={{
    top: 0,
    borderRadius: '20px',
    overflow: 'hidden',
    background: '#1e2b3b', // Custom dark background
  }}
>
  {/* Top Section */}
  <div className="text-center" style={{ padding: "10px" }}>
  <h2
    className="fw-bold text-white"
    style={{ marginTop: 2, fontSize: "1.5rem" }}
  >
    coldOutreach.ai
  </h2>
  <div className="my-3">
    <img
      src={photoUrl}
      alt="User Image"
      className="rounded-circle"
      style={{
        width: "80px",
        height: "80px",
        border: "1px solid #6c757d",
      }}
    />
    <h5 className="mt-2 mb-0" style={{ fontSize: "1rem" }}>
      {user ? user.name : "Loading..."}
    </h5>
    
  </div>
</div>

  <hr style={{ border: "2px solid #ccc", margin: "20px 0", width: "80%" }} />



  {/* Navigation Menu */}
  <ul className="nav flex-column" style={{ gap: '12px' }}>
    <li className="nav-item">
      <a
        onClick={() => handleTabChange('dashboard')}
        className={`nav-link d-flex align-items-center text-white`}
        style={{
          fontSize: '1rem',
          fontWeight: '500',
          padding: '10px',
          borderRadius: '8px',
          transition: 'background-color 0.3s',
        }}
        onMouseEnter={(e) => (e.target.style.backgroundColor = 'rgba(255,255,255,0.1)')}
        onMouseLeave={(e) => (e.target.style.backgroundColor = 'transparent')}
      >
        <FontAwesomeIcon icon={faTachometerAlt} className="me-2" />
        Dashboard
      </a>
    </li>
    <li className="nav-item">
      <a
        onClick={() => handleTabChange('emailConfig')}
        className="nav-link d-flex align-items-center text-white"
        style={{
          fontSize: '1rem',
          fontWeight: '500',
          padding: '10px',
          borderRadius: '8px',
          transition: 'background-color 0.3s',
        }}
        onMouseEnter={(e) => (e.target.style.backgroundColor = 'rgba(255,255,255,0.1)')}
        onMouseLeave={(e) => (e.target.style.backgroundColor = 'transparent')}
      >
        <FontAwesomeIcon icon={faBook} className="me-2" />
        Email Configuration
      </a>
    </li>
    <li className="nav-item">
      <a
        onClick={() => handleTabChange('companyConfig')}
        className="nav-link d-flex align-items-center text-white"
        style={{
          fontSize: '1rem',
          fontWeight: '500',
          padding: '10px',
          borderRadius: '8px',
          transition: 'background-color 0.3s',
        }}
        onMouseEnter={(e) => (e.target.style.backgroundColor = 'rgba(255,255,255,0.1)')}
        onMouseLeave={(e) => (e.target.style.backgroundColor = 'transparent')}
      >
        <FontAwesomeIcon icon={faBook} className="me-2" />
        Company Configuration
      </a>
    </li>
    <li className="nav-item">
      <a
        onClick={() => setShowButtons(!showButtons)}
        className="nav-link d-flex align-items-center text-white"
        style={{
          fontSize: '1rem',
          fontWeight: '500',
          padding: '10px',
          borderRadius: '8px',
          transition: 'background-color 0.3s',
        }}
        onMouseEnter={(e) => (e.target.style.backgroundColor = 'rgba(255,255,255,0.1)')}
        onMouseLeave={(e) => (e.target.style.backgroundColor = 'transparent')}
      >
        <FontAwesomeIcon icon={faEnvelope} className="me-2" />
        Launch Email Compaign
      </a>
    </li>
    {showButtons && (
        <div style={{  marginTop: '5px',marginBottom: '10px' , marginLeft:'50px'}}>
          <button
            onClick={() => handleTabChangeToAi('email-ai')}
            style={{
              marginRight: '10px',
              marginBottom:'10px',
              padding: '8px 16px',
              fontSize: '0.9rem',
              fontWeight: '500',
              color: '#fff',
              backgroundColor: '#007bff',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              transition: 'background-color 0.3s',
            }}
            onMouseEnter={(e) => (e.target.style.backgroundColor = '#0056b3')}
            onMouseLeave={(e) => (e.target.style.backgroundColor = '#007bff')}
          >
            Email Campaign with AI
          </button>
          <button
            onClick={() =>handleTabChangeToAi('email-custom')}
            style={{
              padding: '8px 16px',
              fontSize: '0.9rem',
              fontWeight: '500',
              color: '#fff',
              backgroundColor: '#28a745',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              transition: 'background-color 0.3s',
            }}
            onMouseEnter={(e) => (e.target.style.backgroundColor = '#1e7e34')}
            onMouseLeave={(e) => (e.target.style.backgroundColor = '#28a745')}
          >
            Email Campaign with Custom
          </button>
        </div>
      )}
   
    <li className="nav-item">
      <a
        onClick={() => handleTabChange('documentation')}
        className="nav-link d-flex align-items-center text-white"
        style={{
          fontSize: '1rem',
          fontWeight: '500',
          padding: '10px',
          borderRadius: '8px',
          transition: 'background-color 0.3s',
        }}
        onMouseEnter={(e) => (e.target.style.backgroundColor = 'rgba(255,255,255,0.1)')}
        onMouseLeave={(e) => (e.target.style.backgroundColor = 'transparent')}
      >
        <FontAwesomeIcon icon={faBook} className="me-2" />
        Documentation
      </a>
    </li>
    <li className="nav-item">
      <a
        onClick={() => handleTabChange('pricing')}
        className="nav-link d-flex align-items-center text-white"
        style={{
          fontSize: '1rem',
          fontWeight: '500',
          padding: '10px',
          borderRadius: '8px',
          transition: 'background-color 0.3s',
        }}
        onMouseEnter={(e) => (e.target.style.backgroundColor = 'rgba(255,255,255,0.1)')}
        onMouseLeave={(e) => (e.target.style.backgroundColor = 'transparent')}
      >
        <FontAwesomeIcon icon={faDollarSign} className="me-2" />
        Pricing
      </a>
    </li>
  </ul>

  {/* Bottom Section */}
  <div className="mt-auto text-center">
    <button
      onClick={handleLogout}
      className="btn btn-danger w-100 d-flex align-items-center justify-content-center"
      style={{
        padding: '10px',
        fontSize: '1rem',
        fontWeight: '500',
        borderRadius: '8px',
      }}
    >
      <FontAwesomeIcon icon={faSignOutAlt} className="me-2" />
      Logout
    </button>
  </div>
</div>


        <div className="col-8 offset-4 p-4 bg-secondary text-white" style={{ overflowY: 'auto', height: '100vh' }}>
          {renderContent()}
        </div>
      </div>

      {/* Free Plan Modal */}
      <Modal show={showFreeModal} onHide={handleCloseFreeModal}>
        <Modal.Header closeButton>
          <Modal.Title>Free Plan Details</Modal.Title>
        </Modal.Header>
        <Modal.Body className="paidModal" style={{ backgroundColor: 'black', color: 'white' }}>
          <h4>Free Plan</h4>
          <p>
            The Free Plan is perfect for users who want to try out our service with basic functionality:
          </p>
          <ul>
            <li><strong>Cost:</strong> Free</li>
            <li><strong>Limit:</strong> You can send up to 10 emails per day for 10 days.</li>
            <li><strong>Email Templates:</strong> You need to create and upload your own email templates, as no AI-generated templates are provided in the Free Plan.</li>
            <li><strong>Research and Personalization:</strong> No web scraping or AI research is included. All emails will rely on the content you provide.</li>
          </ul>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseFreeModal}>
            Close
          </Button>
          <Button variant="success" onClick={handleClosePaidModal}>
            Go
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Paid Plan Modal */}
      <Modal show={showPaidModal} onHide={handleClosePaidModal}>
        <Modal.Header closeButton>
          <Modal.Title>Paid Plan Details</Modal.Title>
        </Modal.Header>
        <Modal.Body className="paidModal" style={{ backgroundColor: 'black', color: 'white' }}>
          <h4>Paid Plan</h4>
          <p>
            The Paid Plan offers a comprehensive email marketing solution, ideal for users who need advanced features:
          </p>
          <ul>
            <li><strong>Cost:</strong> $300/month</li>
            <li><strong>Emails:</strong> You can send unlimited emails each day.</li>
            <li><strong>Email Templates:</strong> Our AI generates dynamic and personalized email templates tailored to your audience.</li>
            <li><strong>Research and Personalization:</strong> We use web scraping and data research to ensure that each email is highly personalized and contains up-to-date, relevant information about the recipient’s industry or business.</li>
            <li><strong>Email Sending:</strong> Emails are sent directly from your own email address after setup.</li>
          </ul>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClosePaidModal}>
            Close
          </Button>
          <Button variant="success" onClick={handlePaidModal}>
            Buy Now
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Sidebar;
