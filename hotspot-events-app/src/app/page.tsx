"use client";
import { FaHome, FaCalendarAlt, FaBell, FaUser } from 'react-icons/fa';
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Registration from './Reg';
import Search from './searchBar';
import Link from 'next/link';

export default function Home() {
  const [isRegistered, setIsRegistered] = useState(false);
  const router = useRouter();
  const [isNotificationOpen, setNotificationOpen] = useState(false);
  const notificationRef = useRef(null);

  const [formData, setFormData] = useState({
    eventName: "",
    eventDate: "",
    eventTime: "",
    eventLocation: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Event Details:", formData);
  };

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

  if (!isRegistered) {
    return <Registration onRegister={() => setIsRegistered(true)} />;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <nav className="tab-bar w-full p-4 flex items-center">
        <div className="logo mr-auto">
          <h1>HOTSPOT</h1>
        </div>

        <div className="flex space-x-6">
          <Link href="/homepage" className="tab-button">
            <FaHome />
            <span>Home</span>
          </Link>
          
          <button className="tab-button">
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

      <main className="flex-grow flex items-center justify-center">
        <div className="flex flex-col space-y-4 mb-12 mr-auto">
          <h1 className="text-6xl font-bold ml-5">Welcome to HOTSPOT</h1>
          <Search />
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow-md w-full max-w-md">
          <h2 className="text-2xl font-semibold text-gray-800">Create an Event</h2>
          
          <div>
            <label className="block text-gray-700">Event Name</label>
            <input
              type="text"
              name="eventName"
              value={formData.eventName}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded text-black"
              placeholder="Enter event name"
            />
          </div>

          <div>
            <label className="block text-gray-700">Event Date</label>
            <input
              type="date"
              name="eventDate"
              value={formData.eventDate}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded text-black"
            />
          </div>

          <div>
            <label className="block text-gray-700">Event Time</label>
            <input
              type="time"
              name="eventTime"
              value={formData.eventTime}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded text-black"
            />
          </div>

          <div>
            <label className="block text-gray-700">Event Location</label>
            <input
              type="text"
              name="eventLocation"
              value={formData.eventLocation}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded text-black"
              placeholder="Enter location"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white font-bold py-2 rounded hover:bg-blue-600 transition duration-200"
          >
            Create Event
          </button>
        </form>

      </main>
    </div>
  );
}
