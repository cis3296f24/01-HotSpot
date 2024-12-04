//Form Component

"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Registration from '@/app/register/page';

//Firebase
import { db } from '@/app/firebase';
import { collection, addDoc } from "firebase/firestore";

export default function EventCreationForm() {
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
  );
}
