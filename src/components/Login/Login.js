import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Auth.css";
import background from "../../assets/background.png";
import { BACKEND_URL } from "../../Constant";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [modalShow, setModalShow] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);
    const url = `${BACKEND_URL}/Signup-Login/login`;

    axios
      .post(url, { username, password })
      .then((res) => {
        if (res.status === 200) {
          navigate("/home", { state: { username } });
        }
      })
      .catch((err) => {
        if (err.response && err.response.status === 400) {
          setErrorMessage(err.response.data);
        } else {
          setErrorMessage(err.message);
        }
        setModalShow(true);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const renderContent = () => {
    return (
      <div
        className="auth-wrapper"
        style={{
          backgroundImage: `url(${background})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          minHeight: "100vh",
        }}
      >
        <div className="auth-container">
          <form onSubmit={handleLogin} className="auth-form">
            <h2>Login</h2>
            <p>Admin Login Only</p>
            <input
              type="text"
              placeholder="Enter Your Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <div className="password-container">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter Your Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="toggle-password"
              >
                {showPassword ? "🙈" : "👁️"}
              </span>
            </div>

            <button type="submit" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>
            {errorMessage && <p className="error-message">{errorMessage}</p>}
          </form>
        </div>
      </div>
    );
  };

  return renderContent();
};

export default Login;
