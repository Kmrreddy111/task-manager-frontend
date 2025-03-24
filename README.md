# Task Manager Frontend

This is the **frontend** for the Task Manager application, built using **React.js**. It provides a user-friendly interface for managing tasks, user authentication, and interacting with the backend API.

## Features
- **User Authentication** (Register, Login, Logout)
- **Task Management** (Add, Edit, Delete, Mark Complete)
- **Responsive UI** (Optimized for desktop & mobile)
- **State Management** (Using React Hooks )
- **API Integration** (Connects with the backend for data persistence)
- **Material UI Integration** (For modern and accessible UI components)

## Technologies Used
- React.js
- React Router
- Axios (for API requests)
- Material UI (for styling and components)

## Project Structure
```
src/
├── components/        # Reusable UI components (Navbar, TaskAdder, etc.)
├── pages/            # Page components (Dashboard, Login, Register, etc.)
├── api.js            # API calls for local and from render
├── App.js            # Main application component
├── index.js          # Entry point
├── styles/           # Global styles (CSS/Tailwind)
```

## Installation & Setup

### Prerequisites
Make sure you have **Node.js** and **npm** installed on your system.

### Steps
1. **Clone the repository**
   ```sh
   git clone https://github.com/your-username/task-manager-frontend.git
   cd task-manager-frontend
   ```
2. **Install dependencies**
   ```sh
   npm install
   ```
3. **Create an environment file** (`.env` in the root directory)
   ```env
   REACT_APP_API_URL=http://localhost:5000/api
   ```
4. **Start the development server**
   ```sh
   npm start
   ```

## API Configuration
This frontend interacts with a backend API. Ensure that the backend is running at the URL specified in `.env`.

## Deployment
To build the production-ready version:
```sh
npm run build
```
This generates a `build/` folder that can be deployed to any static hosting service like **Vercel, Netlify, or GitHub Pages**.

## Troubleshooting
- If you face **CORS issues**, ensure that the backend has proper CORS headers enabled.
- Check the `.env` file for the correct API URL.
- Run `npm audit fix` if there are dependency vulnerabilities.
- Ensure that **Material UI** dependencies are correctly installed and imported.

## Contributing
Feel free to fork the repository and submit pull requests!

## License
This project is licensed under the **MIT License**.

---

🚀 Happy Coding! 🎯

