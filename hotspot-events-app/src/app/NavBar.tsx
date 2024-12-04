"use client";
import { FaHome, FaCalendarAlt, FaBell, FaUser, FaFire } from "react-icons/fa";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";

export default function NavBar() {
  const [isNotificationOpen, setNotificationOpen] = useState(false);
  const notificationRef = useRef(null);

  // Toggle notification dropdown
  const toggleNotifications = () => {
    setNotificationOpen(!isNotificationOpen);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setNotificationOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav className="tab-bar w-full p-4 flex items-center">
      <div className="logo mr-auto">
        <h1>HOTSPOT</h1>
      </div>

      <div className="flex space-x-6">
        {/* Replace with Link components */}
        <Link href="/" className="tab-button">
          <FaHome />
          <span>Home</span>
        </Link>

        <Link href="/events" className="tab-button">
          <FaCalendarAlt />
          <span>Events</span>
        </Link>

        <Link href="/hotspots" className="tab-button">
          <FaFire />
          <span>Hotspots</span>
        </Link>

        <div className="relative" ref={notificationRef}>
          <button className="tab-button" onClick={toggleNotifications}>
            <FaBell />
            <span>Notifications</span>
          </button>
          {isNotificationOpen && (
              <div
                className="absolute top-full w-80 right-0 bg-white shadow-lg rounded-lg p-2"
                style={{
                  marginTop: '-4px', // Pulls the dropdown closer to the button
                  paddingTop: '4px', // Minimal padding inside the dropdown
                  paddingBottom: '4px',
                }}
              >
                <p className="text-md font-semibold mb-1">Alerts</p>
                <ul className="space-y-1">
                  <li className="text-sm text-gray-600 leading-tight">New event scheduled for tomorrow</li>
                  <li className="text-sm text-gray-600 leading-tight">Event location changed</li>
                  <li className="text-sm text-gray-600 leading-tight">Reminder: RSVP to upcoming event</li>
                </ul>
              </div>
            )}
        </div>
        <Link href="/profile" className="tab-button">
          <FaUser />
          <span>Profile</span>
        </Link>
      </div>
    </nav>
  );
}
