import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import AuthContext from '../context/AuthContext';
import './Layout.css';

const Layout = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <div className="layout">
      <header className="header">
        <div className="container">
          <div className="header-content">
            <div className="logo" onClick={() => navigate('/')}>
              <h1>Namma TapNGo</h1>
              <p className="tagline">Scan. Ride. Pay. Simple.</p>
            </div>
            <div className="user-info">
              <span>Hello, {user?.name}</span>
              <span className="wallet-balance">₹{user?.walletBalance.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </header>

      <nav className="navbar">
        <div className="container">
          <ul className="nav-links">
            <li>
              <NavLink to="/" end>
                Dashboard
              </NavLink>
            </li>
            <li>
              <NavLink to="/wallet">
                Wallet
              </NavLink>
            </li>
            <li>
              <NavLink to="/trips">
                Trip History
              </NavLink>
            </li>
            <li>
              <NavLink to="/gate-simulator">
                Gate Simulator
              </NavLink>
            </li>
            <li style={{ marginLeft: 'auto' }}>
              <button className="logout-btn" onClick={logout}>
                Logout
              </button>
            </li>
          </ul>
        </div>
      </nav>

      <main className="main-content">
        <div className="container">
          <Outlet />
        </div>
      </main>

      <footer className="footer">
        <div className="container">
          <p>&copy; {new Date().getFullYear()} Namma TapNGo. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;