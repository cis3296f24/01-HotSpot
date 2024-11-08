"use client";

import { FaHome, FaCalendarAlt, FaBell, FaUser } from 'react-icons/fa';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen" style={{ backgroundColor: '#edeced' }}>
      
      {/* Tab Bar */}
      <nav className="tab-bar w-full p-4 flex items-center">
        <div className="logo mr-auto">
          <h1>HOTSPOT</h1>
        </div>

        <div className="flex space-x-6">
          <Link href="/homepage" className="tab-button">
            <FaHome />
            <span>Home</span>
          </Link>

          {/* Events redirects to main page.tsx file*/}
          <Link href="/" className="tab-button">
            <FaCalendarAlt />
            <span>Events</span>
          </Link>

          <Link href="/notifications" className="tab-button">
            <FaBell />
            <span>Notifications</span>
          </Link>

          <Link href="/profile" className="tab-button">
            <FaUser />
            <span>Profile</span>
          </Link>
        </div>
      </nav>

      {/* Main content of the homepage */}
      <div className="flex flex-col items-center justify-center flex-grow">
        <h1 
          className="welcome-text fade-in-shadow"
        >
          Welcome to Hotspot
        </h1>
      </div>
    </div>
  );
}
