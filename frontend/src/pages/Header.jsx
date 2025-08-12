import React from 'react';
import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
    const handleLogout = () => {
    logout();
    navigate("/"); // Redirect after logout
  };

  return (
    <header className="bg-blue-600 text-white px-6 py-4 shadow-md flex justify-between items-center">
      <Link to="#" className="text-xl font-bold">
        SiteOps
      </Link>

      <nav className="space-x-4">
        <Link to="/dashboard">Home</Link>
         <Link to="/sites">Sites</Link>
        <Link to="/risks">Risks</Link>
        <Link to="/files">Files</Link>

        {user?.role !== 'client' && (
          <>
            <Link to="/tickets">Tickets</Link>
          </>
        )}
        {(user?.role === 'superadmin' || user?.role === 'admin') && (
          <>
            <Link to="/users">Users</Link>
            <Link to="/register">Register</Link>
          </>
        )}


        {user ? (
          <button
            onClick={handleLogout}
            className="bg-red-500 px-3 py-1 rounded hover:bg-red-600"
          >
            Logout
          </button>
        ) : (
          <Link to="/" className="bg-white text-blue-600 px-3 py-1 rounded hover:bg-gray-100">
            Login
          </Link>
        )}
      </nav>
    </header>
  );
};

export default Header;
