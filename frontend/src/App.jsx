import './App.css'
import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Auth/Login';
import Dashboard from './pages/Dashboard';
import Register from './pages/Auth/Register';
import Sites from './pages/Sites';
import Tickets from './pages/Tickets';
import Risks from './pages/Risks';
import Users from './pages/Users';
import FileUploader from './pages/FileUploader';
import Header from './pages/Header';
import Footer from './pages/Footer';


function App() {
    return (
        <div className="flex flex-col min-h-screen">
        <Router>
            <Header />
            <Routes>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/sites" element={<Sites />} />
                <Route path="/tickets" element={<Tickets />} />
                <Route path="/risks" element={<Risks />} />
                <Route path="/users" element={<Users />} />
                <Route path="/files" element={<FileUploader />} />



                {/* other routes */}
            </Routes>
            <Footer />
        </Router>
        </div>
    );
}

export default App
