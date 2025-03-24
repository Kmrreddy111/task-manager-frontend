import React, { useState, useEffect } from "react";
import axios from "axios";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import MenuItem from "@mui/material/MenuItem";
import { apiUrl } from "../../api";

const TaskAdder = ({ open, handleClose, taskToEdit, refreshTasks }) => {
  const token = localStorage.getItem("token"); // Get token from localStorage
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "pending",
    category: "",
    priority: "low",
    dueDate: "",
  });
  const [categories, setCategories] = useState([]); // State to store categories
  const [loading, setLoading] = useState(false); // Loading state

  // Fetch categories from the backend
  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/categories`, {
        // headers: { Authorization: `Bearer ${token}` },
      });
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  // Populate form data if editing a task
  useEffect(() => {
    if (taskToEdit) {
      setFormData({
        title: taskToEdit.title || "",
        description: taskToEdit.description || "",
        status: taskToEdit.status || "pending",
        category: taskToEdit.category || "",
        priority: taskToEdit.priority || "low",
        dueDate: taskToEdit.dueDate ,
      });
    } else {
      resetFormData();
    }
  }, [taskToEdit]);

  // Fetch categories when the component is mounted
  useEffect(() => {
    fetchCategories();
  }, []);

  // Reset form data
  const resetFormData = () => {
    setFormData({
      title: "",
      description: "",
      status: "pending",
      category: "",
      priority: "low",
      dueDate: "",
    });
  };

  // Handle form input changes
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
    setLoading(true); // Set loading to true

    // Validate required fields
    if (!formData.title.trim()) {
      alert("Title is required.");
      setLoading(false);
      return;
    }

    try {
      if (taskToEdit) {
        // Update task
        await axios.put(
          `${apiUrl}/api/tasks/${taskToEdit._id}`,
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        // Add new task
        await axios.post(`${apiUrl}/api/tasks`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      refreshTasks(); // Refresh the task list in the parent component
      handleClose(); // Close the dialog
    } catch (error) {
      console.error("Error saving task:", error);
      alert("An error occurred while saving the task. Please try again.");
    } finally {
      setLoading(false); // Set loading to false
    }
  };

  return (
    <>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{taskToEdit ? "Update Task" : "Add Task"}</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <TextField
              margin="dense"
              label="Title"
              type="text"
              fullWidth
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              InputProps={{
                style: {
                  textDecoration: formData.status === "completed" ? "line-through" : "none", // Apply line-through if completed
                },
              }}
            />
            <TextField
              margin="dense"
              label="Description"
              type="text"
              fullWidth
              name="description"
              value={formData.description}
              onChange={handleChange}
            />
            <TextField
              margin="dense"
              label="Status"
              select
              fullWidth
              name="status"
              value={formData.status || "pending"}
              onChange={handleChange}
            >
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="in-progress">In Progress</MenuItem>
              <MenuItem value="completed">Completed</MenuItem>
            </TextField>
            

            <TextField
              margin="dense"
              label="Priority"
              select
              fullWidth
              name="priority"
              value={formData.priority || "low"}
              onChange={handleChange}
            >
              <MenuItem value="low">Low</MenuItem>
              <MenuItem value="medium">Medium</MenuItem>
              <MenuItem value="high">High</MenuItem>
            </TextField>
            <TextField
              margin="dense"
              label="category"
              select
              fullWidth
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              

            >
              {categories.map((category) => (
                <MenuItem key={category._id} value={category._id}>
                  {category.name}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              margin="dense"
              label="Due Date"
              type="date"
              fullWidth
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </DialogContent>
          <DialogActions>
            
            <Button onClick={handleClose} color="secondary">
              Cancel
            </Button>
            <Button type="submit" color="primary" disabled={loading}>
              {loading ? "Saving..." : taskToEdit ? "Update" : "Create"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      
    </>
  );
};

export default TaskAdder;
