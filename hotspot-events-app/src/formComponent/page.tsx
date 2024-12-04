"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Registration from '@/app/Reg';

//Firebase
import { db } from '@/app/firebase';
import { collection, addDoc } from "firebase/firestore";

// Define interface for location results
interface LocationResult {
  display_name: string;
  lat?: string;
  lon?: string;
  type?: string;
}

// Define interface for location results
interface LocationResult {
  display_name: string;
  lat?: string;
  lon?: string;
  type?: string;
}

export default function EventCreationForm() {
  const [isRegistered, setIsRegistered] = useState(false);
  const router = useRouter();
  const [isNotificationOpen, setNotificationOpen] = useState(false);
  const notificationRef = useRef(null);

  const hotspotLocations = [
    "Rittenhouse Square",
    "The Wall",
    "City Hall",
    "Bell Tower",
  ];


  const [formData, setFormData] = useState({
    eventName: "",
    eventDate: "",
    eventTime: "",
    eventLocation: "",
    isCustomLocation: false,
  });

  const handleLocationSearch = async (query: string) => {
    if (query.length < 3) {
      setLocations([]);
      return;
    }

    try {
      // OpenStreetMap Nominatim API, free api. Does not have all the features like Google
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`
      );
      const data: LocationResult[] = await response.json();
      setLocations(data.slice(0, 5)); // Limit to 5 results
    } catch (error) {
      console.error("Location search error:", error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const handleLocationSearch = async (query: string) => {
    if (query.length < 3) {
      setLocations([]);
      return;
    }

    try {
      // OpenStreetMap Nominatim API, free api. Does not have all the features like Google
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`
      );
      const data: LocationResult[] = await response.json();
      setLocations(data.slice(0, 5)); // Limit to 5 results
    } catch (error) {
      console.error("Location search error:", error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleLocationChange = (e) => {
    const value = e.target.value;
    if (value === "custom") {
      setFormData((prevData) => ({ ...prevData, eventLocation: "", isCustomLocation: true }));
    } else {
      setFormData((prevData) => ({ ...prevData, eventLocation: value, isCustomLocation: false }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
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
        isCustomLocation: false,
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
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
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
        <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow-md w-full max-w-md relative">
          <h2 className="text-2xl font-semibold text-black">Create an Event</h2>
        <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow-md w-full max-w-md relative">
          <h2 className="text-2xl font-semibold text-black">Create an Event</h2>

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
            <select
              name="eventLocation"
              value={formData.isCustomLocation ? "custom" : formData.eventLocation}
              onChange={handleLocationChange}
              required
              className="w-full p-2 border border-gray-300 rounded text-black"
            >
            <option value="" disabled>Select a location</option>
              {hotspotLocations.map((location, index) => (
                <option key={index} value={location}>
                  {location}
                </option>
              ))}
            <option value="custom">Enter a custom location</option>
            </select>

            {formData.isCustomLocation && (
          <input
            type="text"
            name="eventLocation"
            value={formData.eventLocation}
            onChange={handleChange}
            required
            className="w-full p-2 mt-2 border border-gray-300 rounded text-black"
            placeholder="Enter custom location"
          />
        )}
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