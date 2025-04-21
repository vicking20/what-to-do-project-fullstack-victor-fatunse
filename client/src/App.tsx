//App.tsx

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./components/Pages/Dashboard";
import TaskPage from "./components/Pages/TaskPage";
import './App.css'
import NavBar from "./components/Base/Navbar";
import ErrorPage from "./components/Pages/Errorpage";

function App() {
  return (
    <Router>
      <div className="app-container">
        <NavBar /> 
        <div className="content-container">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/tasks" element={<TaskPage />} />
            <Route path="*" element={<ErrorPage />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;