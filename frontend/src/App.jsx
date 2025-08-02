import './App.css'
import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Auth/Login';
import Dashboard from './pages/Dashboard';
import Register from './pages/Auth/Register';
import Sites from './pages/Sites';
import Tickets from './pages/Tickets';
import Users from './pages/Users';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/sites" element={<Sites />} />
                <Route path="/tickets" element={<Tickets />} />
                <Route path="/users" element={<Users />} />


                {/* other routes */}
            </Routes>
        </Router>
    );
}

export default App
