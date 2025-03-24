import React, { useState } from "react";
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // Import Axios
import "./Login.css";
import { apiUrl } from "../../api";

function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors

    try {
      // Make a POST request to the backend login route
      const response = await axios.post(`${apiUrl}/api/auth/login`, formData);

      // Save the token and user data to localStorage
      localStorage.setItem("token", response.data.token);

      // Redirect to the dashboard
      navigate("/dashboard");
    } catch (error) {
      setError(error.response?.data?.message || "Login failed. Please try again.");
    }
  };

  return (
    <div className="auth-container">
      <Card className="auth-card" sx={{ maxWidth: 360, width: "90%" }}>
        <h2 className="heading-line">Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="center-line">
            <TextField
              id="email"
              label="Email"
              variant="standard"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange} // Update formData state
              required
            />
          </div>
          <div className="center-line">
            <TextField
              id="password"
              label="Password"
              variant="standard"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange} // Update formData state
              required
            />
          </div>

          {error && <p className="error-message">{error}</p>} {/* Display error message */}

          <div className="center-line">
            <Button className="auth-button" variant="contained" color="success" type="submit">
              Login
            </Button>
          </div>
        </form>
        <div className="register-btn-container">
          <Button variant="text" onClick={() => navigate("/register")}>
            Register
          </Button>
        </div>
      </Card>
    </div>
  );
}

export default Login;