import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Home.css";
import logo_icon from "../../assets/logo.png";
import { BACKEND_URL1 } from "../../Constant1";
function Home() {
  const [activeRecords, setActiveRecords] = useState([]);
  const [historyRecords, setHistoryRecords] = useState([]);
  const [view, setView] = useState("active"); // "active" or "history"
  const navigate = useNavigate();
  const location = useLocation();

  const fetchActiveRecords = () => {
    const url = `${BACKEND_URL1}/Incident/get-all-active`; // Replace with your backend endpoint for active reports
    fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setActiveRecords(data.records);
        } else {
          console.error("Failed to fetch active records.");
        }
      })
      .catch((error) => console.error("Error fetching active records:", error));
  };

  const fetchHistoryRecords = () => {
    const url = `${BACKEND_URL1}/Incident/get-all-innactive`; // Replace with your backend endpoint for history reports
    fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setHistoryRecords(data.records);
        } else {
          console.error("Failed to fetch history records.");
        }
      })
      .catch((error) =>
        console.error("Error fetching history records:", error)
      );
  };

  const resolveRecord = (recordId) => {
    const comment = prompt("Please enter a comment before resolving:");
    if (!comment) {
      alert("Comment is required to resolve the record.");
      return;
    }

    const url = `${BACKEND_URL1}/Incident/resolve/${recordId}`; // Backend endpoint for resolving a record
    fetch(url, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ comment }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          // Remove the resolved record from activeRecords and refresh historyRecords
          setActiveRecords((prev) =>
            prev.filter((record) => record._id !== recordId)
          );
          fetchHistoryRecords(); // Refresh history records to include the resolved one
        } else {
          console.error("Failed to resolve the record.");
        }
      })
      .catch((error) => console.error("Error resolving record:", error));
  };

  // Fetch records when the component is mounted
  useEffect(() => {
    fetchActiveRecords();
    fetchHistoryRecords();
  }, []);

  const displayRecords = (records, isActive) => (
    <div className="records-display">
      {Array.isArray(records) && records.length > 0 ? (
        records.map((record) => (
          <div key={record._id} className="record-card">
            <p>
              <b>Record ID:</b> {record._id}
            </p>
            <p>
              <b>Description:</b> {record.text}
            </p>
            <p></p>
            {record.file && (
              <p>
                <b>File:</b>
                <a href={record.file} target="_blank" rel="noopener noreferrer">
                  View File
                </a>
              </p>
            )}
            <p>
              <b>Status:</b> {record.isActive ? "Active" : "Inactive"}
            </p>
            <p>
              <b>Created At:</b> {new Date(record.createdAt).toLocaleString()}
            </p>
            {isActive && (
              <button
                className="resolve-button"
                onClick={() => resolveRecord(record._id)}
              >
                Resolve
              </button>
            )}
          </div>
        ))
      ) : (
        <p>No records to display.</p>
      )}
    </div>
  );

  return (
    <div className="home-container">
      <header className="header">
        <div className="title" style={{ cursor: "pointer" }}>
          <img src={logo_icon} alt="Logo" className="logo" />
          <h1>Billy - Admin Portal </h1>
        </div>

        <nav className="nav-buttons"></nav>
      </header>
      <nav className="navbar">
        <button
          className={`nav-button ${view === "active" ? "active" : ""}`}
          onClick={() => setView("active")}
        >
          Active Reports
        </button>
        <button
          className={`nav-button ${view === "history" ? "active" : ""}`}
          onClick={() => setView("history")}
        >
          Reports History
        </button>
      </nav>
      <main className="content">
        {view === "active"
          ? displayRecords(activeRecords, true)
          : displayRecords(historyRecords, false)}
      </main>
      <footer className="footer">
        <p>© 2024 Billy - Buddy against Cyber Bullying. All rights reserved.</p>
        <p>
          Contact us: <a href="mailto:support@billy.com">support@billy.com</a>|
          Phone: <a href="tel:+1234567890">+1 (234) 567-890</a>
        </p>

        <div className="social-media">
          <a
            href="https://www.facebook.com/billy"
            target="_blank"
            rel="noopener noreferrer"
          >
            Facebook
          </a>{" "}
          |
          <a
            href="https://www.twitter.com/billy"
            target="_blank"
            rel="noopener noreferrer"
          >
            Twitter
          </a>{" "}
          |
          <a
            href="https://www.instagram.com/billy"
            target="_blank"
            rel="noopener noreferrer"
          >
            Instagram
          </a>{" "}
          |
          <a
            href="https://www.linkedin.com/company/billy"
            target="_blank"
            rel="noopener noreferrer"
          >
            LinkedIn
          </a>
        </div>
      </footer>
    </div>
  );
}

export default Home;
