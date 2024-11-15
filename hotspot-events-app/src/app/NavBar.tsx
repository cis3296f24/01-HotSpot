// components/NavBar.tsx
"use client";
import { FaHome, FaCalendarAlt, FaBell, FaUser } from "react-icons/fa";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function NavBar() {
  const router = useRouter();
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
        <Link href="/" className="tab-button">
          <FaHome />
          <span>Home</span>
        </Link>

        <button className="tab-button" onClick={() => router.push("/events")}>
          <FaCalendarAlt />
          <span>Events</span>
        </button>

        <div className="relative" ref={notificationRef}>
          <button className="tab-button" onClick={toggleNotifications}>
            <FaBell />
            <span>Notifications</span>
          </button>
          {isNotificationOpen && (
            <div className="absolute top-full right-0 mt-2 w-64 bg-white shadow-lg rounded-lg p-4">
              <p className="text-lg font-semibold">Alerts</p>
              <ul className="space-y-2 mt-2">
                <li className="text-sm text-gray-600">New event scheduled for tomorrow</li>
                <li className="text-sm text-gray-600">Event location changed</li>
                <li className="text-sm text-gray-600">Reminder: RSVP to upcoming event</li>
              </ul>
            </div>
          )}
        </div>

        <button className="tab-button" onClick={() => router.push("/profile")}>
          <FaUser />
          <span>Profile</span>
        </button>
      </div>
    </nav>
  );
}
