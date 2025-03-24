import React, { useState, useEffect } from "react";
import axios from "axios";
import TaskAdder from "../../components/TaskAdder/TaskAdder";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionActions from "@mui/material/AccordionActions";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import "./Dashboard.css"; // Import the CSS file
import { apiUrl } from "../../api";

function Dashboard() {
  const token = localStorage.getItem("token"); // Get token from localStorage
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]); // Filtered tasks for search
  const [categories, setCategories] = useState([]); // Categories for the dropdown
  const [selectedCategory, setSelectedCategory] = useState(""); // Selected category filter
  const [searchQuery, setSearchQuery] = useState(""); // Search query
  const [openTaskDialog, setOpenTaskDialog] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);
  const [taskToDelete, setTaskToDelete] = useState(null); // Track task to delete
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false); // Track delete confirmation dialog
  const [filterType, setFilterType] = useState("all");
  

  // Fetch tasks from the backend
  const fetchTasks = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/tasks`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(response.data);
      setFilteredTasks(response.data); // Initialize filtered tasks
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  // Fetch categories from the backend
  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/categories`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    fetchTasks();
    fetchCategories();
  }, []);

  // Handle search input change
  const handleSearchChange = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    filterTasks(query, selectedCategory);
  };

  // Handle category selection change
  const handleCategoryChange = (e) => {
    const category = e.target.value;
    setSelectedCategory(category);
    filterTasks(searchQuery, category);
  };

  // Filter tasks based on search query and selected category
  const filterTasks = (query, category) => {
    let filtered = tasks;

    if (query) {
      filtered = filtered.filter((task) =>
        task.title.toLowerCase().includes(query)
      );
    }

    if (category) {
      filtered = filtered.filter((task) => task.category === category);
    }

    setFilteredTasks(filtered);
  };

  // Open dialog for adding a new task
  const handleAddTask = () => {
    setTaskToEdit(null); // Clear taskToEdit for new task
    setOpenTaskDialog(true);
  };

  // Open dialog for editing a task
  const handleEditTask = (task) => {
    setTaskToEdit(task);
    setOpenTaskDialog(true);
  };

  // Open delete confirmation dialog
  const handleDeleteTask = (task) => {
    setTaskToDelete(task);
    setOpenDeleteDialog(true);
  };

  // Close delete confirmation dialog
  const handleCloseDeleteDialog = () => {
    setTaskToDelete(null);
    setOpenDeleteDialog(false);
  };

  // Confirm and delete the task
  const confirmDeleteTask = async () => {
    try {
      await axios.delete(
        `${apiUrl}/api/tasks/${taskToDelete._id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setTasks(tasks.filter((task) => task._id !== taskToDelete._id)); // Remove the task from the list
      setFilteredTasks(
        filteredTasks.filter((task) => task._id !== taskToDelete._id)
      ); // Update filtered tasks
      handleCloseDeleteDialog(); // Close the dialog
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  // Calculate task metrics
  const totalTasks = tasks.length;
  const activeTasks = tasks.filter(
    (task) => task.status === "pending" || task.status === "in-progress"
  ).length;
  const finishedTasks = tasks.filter(
    (task) => task.status === "completed"
  ).length;

  // Function to format the due date
  const formatDueDate = (dueDate) => {
    if (!dueDate) return "No Due Date";
    return dueDate // Extract only the date part (YYYY-MM-DD)
  };

  // Function to determine due date color
  const getDueDateColor = (dueDate) => {
    if (!dueDate) return "black"; // Default color for no due date
    const today = new Date();
    const taskDueDate = new Date(dueDate);

    if (taskDueDate.toDateString() === today.toDateString()) {
      return "blue"; // Due today
    } else if (taskDueDate > today) {
      return "green"; // Due in the future
    } else {
      return "red"; // Overdue
    }
  };

  // Update the filterTasks function to include filterType
  const filterTask = (query, category, type = filterType) => {
    let filtered = tasks;

    if (type === "active") {
      filtered = filtered.filter(
        (task) => task.status === "pending" || task.status === "in-progress"
      );
    } else if (type === "finished") {
      filtered = filtered.filter((task) => task.status === "completed");
    }

    if (query) {
      filtered = filtered.filter((task) =>
        task.title.toLowerCase().includes(query)
      );
    }

    if (category) {
      filtered = filtered.filter((task) => task.category === category);
    }

    setFilteredTasks(filtered);
  };

  // Add a function to handle card clicks
  const handleCardClick = (type) => {
    setFilterType(type);
    filterTask(searchQuery, selectedCategory, type);
  };

  return (
    <div className="dashboard-container">
      {/* Task Metrics Cards */}

      <div className="dashboard-block">
        <div className="task-metrics">
          <Card className="task-card" onClick={() => handleCardClick("all")}>
            <CardContent>
              <Typography variant="h6">Total Tasks</Typography>
              <Typography variant="h4">{totalTasks}</Typography>
            </CardContent>
          </Card>
          <Card className="task-card" onClick={() => handleCardClick("active")}>
            <CardContent>
              <Typography variant="h6">Active Tasks</Typography>
              <Typography variant="h4">{activeTasks}</Typography>
            </CardContent>
          </Card>
          <Card
            className="task-card"
            onClick={() => handleCardClick("finished")}
          >
            <CardContent>
              <Typography variant="h6">Finished Tasks</Typography>
              <Typography variant="h4">{finishedTasks}</Typography>
            </CardContent>
          </Card>
        </div>
        
        <div className="add-task-block">
          <TextField
            label="Search Tasks"
            variant="outlined"
            size="small"
            value={searchQuery}
            onChange={handleSearchChange}
            style={{ marginRight: "10px", flex: 1 }}
          />
          <TextField
            label="Category"
            variant="outlined"
            size="small"
            select
            value={selectedCategory}
            onChange={handleCategoryChange}
            style={{ marginRight: "10px", flex: 1 }}
          >
            <MenuItem value="">All Categories</MenuItem>
            {categories.map((category) => (
              <MenuItem key={category._id} value={category._id}>
                {category.name}
              </MenuItem>
            ))}
          </TextField>
          <Button variant="contained" color="primary" onClick={handleAddTask}>
            Add Task
          </Button>
        </div>
        <div>
          {filteredTasks.map((task) => (
            <Accordion key={task._id}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls={`panel-${task._id}-content`}
                id={`panel-${task._id}-header`}
              >
                <div className="typography-title">
                  <Typography component="span">{task.title} </Typography>
                  <Typography
                    component="span"
                    style={{ color: getDueDateColor(task.dueDate) }}
                  >
                    {formatDueDate(task.dueDate)}
                  </Typography>
                </div>
              </AccordionSummary>
              <AccordionDetails>
                <Typography component="span">{task.description}</Typography>
              </AccordionDetails>
              <AccordionActions>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleEditTask(task)}
                >
                  Edit
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => handleDeleteTask(task)}
                >
                  Delete
                </Button>
              </AccordionActions>
            </Accordion>
          ))}
        </div>
      </div>
      <TaskAdder
        open={openTaskDialog}
        handleClose={() => setOpenTaskDialog(false)}
        taskToEdit={taskToEdit}
        refreshTasks={fetchTasks}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={handleCloseDeleteDialog}
        className="delete-dialog"
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete the task "{taskToDelete?.title}"?
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} color="secondary">
            Cancel
          </Button>
          <Button onClick={confirmDeleteTask} color="primary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default Dashboard;
