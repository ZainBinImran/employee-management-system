import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  const location = useLocation();

  const isActive = (path) => location.pathname === path ? 'nav-link active' : 'nav-link';

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <span className="brand-icon">👥</span>
        <span className="brand-text">EMS</span>
      </div>
      <ul className="nav-links">
        <li><Link to="/" className={isActive('/')}>Dashboard</Link></li>
        <li><Link to="/employees" className={isActive('/employees')}>Employees</Link></li>
        <li><Link to="/departments" className={isActive('/departments')}>Departments</Link></li>
      </ul>
    </nav>
  );
}

export default Navbar;
