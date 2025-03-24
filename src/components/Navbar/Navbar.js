import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import axios from "axios";
import { apiUrl } from "../../api.js";

function Navbar() {
  const navigate = useNavigate();
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false); // State for logout confirmation dialog

  // Open the logout confirmation dialog
  const openLogoutDialog = () => {
    setLogoutDialogOpen(true);
  };

  // Close the logout confirmation dialog
  const closeLogoutDialog = () => {
    setLogoutDialogOpen(false);
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      // Make a POST request to the backend logout route
      await axios.post(
        `${apiUrl}/api/user/logout`, // Replace with your logout endpoint
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Include the token in the request
          },
        }
      );

      // Remove token and user data from localStorage
      localStorage.removeItem("token");

      // Redirect to login page
      navigate("/login");
    } catch (error) {
      console.error("Error during logout:", error);
      alert("Failed to log out. Please try again.");
    }
  };

  // Check if the user is logged in
  const isLoggedIn = !!localStorage.getItem("token");

  if (!isLoggedIn) {
    // If the user is not logged in, do not render the Navbar
    return null;
  }

  return (
    <>
      <nav
        style={{
          padding: "10px",
          backgroundColor: "#333",
          color: "#fff",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {/* Task Manager Link */}
        <Link
          to="/dashboard"
          style={{
            color: "#fff",
            textDecoration: "none",
            fontSize: "18px",
          }}
        >
          Task Manager
        </Link>

        {/* Profile Icon and Logout */}
        <div style={{ display: "flex", alignItems: "center" }}>
          <span
            style={{ marginRight: "10px", cursor: "pointer" }}
            onClick={openLogoutDialog} // Open the logout confirmation dialog
          >
            Logout
          </span>
          <img
            src="https://res.cloudinary.com/dbb0dzkem/image/upload/v1739872323/Avatar_dtibzc.png" // Replace with a profile icon URL or an actual image
            alt="Profile"
            style={{ borderRadius: "50%", cursor: "pointer" }}
          />
        </div>
      </nav>

      {/* Logout Confirmation Dialog */}
      <Dialog open={logoutDialogOpen} onClose={closeLogoutDialog}>
        <DialogTitle>Confirm Logout</DialogTitle>
        <DialogContent>
          Are you sure you want to log out?
        </DialogContent>
        <DialogActions>
          <Button onClick={closeLogoutDialog} color="secondary">
            Cancel
          </Button>
          <Button
            onClick={() => {
              closeLogoutDialog();
              handleLogout();
            }}
            color="primary"
          >
            Logout
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default Navbar;