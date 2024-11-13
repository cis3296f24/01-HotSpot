// src/app/events/page.tsx

"use client";
import { useState, useEffect } from "react";
import { FaHome, FaCalendarAlt, FaBell, FaUser } from 'react-icons/fa';
//import { db } from '../app/firebase';
//import { collection, getDocs } from "firebase/firestore";
import Link from 'next/link';

export default function Events() {
  const [events, setEvents] = useState([]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Event Details:", formData);

    try {
      const docRef = await addDoc(collection(db, "events"), formData);
      console.log("Document written with ID: ", docRef.id);
      alert("Event created successfully!");

      setFormData({
        eventName: "",
        eventDate: "",
        eventTime: "",
        eventLocation: "",
      });
    } catch (error) {
      console.error("Error adding document: ", error);
      alert("Failed to create event. Please try again.");
    }
  };

  // Fetch events from Firestore
  // useEffect(() => {
  //   const fetchEvents = async () => {
  //     try {
  //       const querySnapshot = await getDocs(collection(db, "events"));
  //       const eventsData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  //       setEvents(eventsData);
  //     } catch (error) {
  //       console.error("Error fetching events: ", error);
  //     }
  //   };

  //   fetchEvents();
  // }, []);

  return (
    <div className="flex flex-col min-h-screen" style={{ backgroundColor: '#edeced' }}>
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
    <div className="flex flex-1 justify-center items-center">
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md w-full max-w-md space-y-4"> 
          <h2 className="text-2xl font-semibold text-gray-800 text-center mb-4">Create a New Event</h2>
          
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
        </div>
        </div>
   );
}
