import React, { useState } from "react";
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { Link } from "react-router-dom"; // Import Link for navigation
import axios from "axios"; // Import Axios
import "./Register.css";
import { useNavigate } from "react-router-dom";
import { apiUrl } from "../../api";


function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }
  
    try {
      // Make a POST request to the backend register route
      const response = await axios.post(`${apiUrl}/api/auth/register`, {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });
  
      // Handle success response
      console.log("Registration successful:", response.data);
      alert("Registration successful!");
      // Save the token and user data to localStorage
      localStorage.setItem("token", response.data.token);

      // Redirect to the dashboard
      navigate("/dashboard");
    } catch (error) {
      // Handle error response
      console.error("Registration failed:", error.response?.data || error.message);
      alert(error.response?.data?.message || "Registration failed. Please try again.");
    }
  };

  return (
    <div className="register-container">
      <Card className="register-card" sx={{ maxWidth: 360, width: "90%" }}>
        <h2 className="center-line">Register</h2>
        <form onSubmit={handleSubmit}>
          <div className="center-line">
            <TextField
              id="name"
              label="Name"
              variant="standard"
              type="text"
              required
              name="name"
              value={formData.name}
              onChange={handleChange}
              sx={{ width: "80%" }} 

            />
          </div>

          <div className="center-line">
            <TextField
              id="email"
              label="Email"
              variant="standard"
              type="email"
              required
              name="email"
              value={formData.email}
              onChange={handleChange}
              sx={{ width: "80%" }}
            />
          </div>

          <div className="center-line">
            <TextField
              id="password"
              label="Password"
              variant="standard"
              type="password"
              required
              name="password"
              value={formData.password}
              onChange={handleChange}
              sx={{ width: "80%" }} 
            />
          </div>

          <div className="center-line">
            <TextField
              id="confirmPassword"
              label="Confirm Password"
              variant="standard"
              type="password"
              required
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              sx={{ width: "80%" }}
            />
          </div>

          <div className="register-button">
            <Button variant="contained" color="success" type="submit">
              Register
            </Button>
          </div>
        </form>
        <div className="login-redirect">
          
          <Link to="/login">
            <Button variant="text" >
              Login
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}

export default Register;