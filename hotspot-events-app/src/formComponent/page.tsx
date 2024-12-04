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

export default function EventCreationForm() {
  const [isRegistered, setIsRegistered] = useState(false);
  const router = useRouter();
  const [isNotificationOpen, setNotificationOpen] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);

  const [locations, setLocations] = useState<LocationResult[]>([]);

  const [formData, setFormData] = useState({
    eventName: "",
    eventDate: "",
    eventTime: "",
    eventLocation: "",
  });

  const handleLocationSearch = async (query: string) => {
    if (query.length < 3) {
      setLocations([]);
      return;
    }

    try {
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
    
    if (name === "eventLocation") {
      handleLocationSearch(value);
    }
  };

  const selectLocation = (location: LocationResult) => {
    setFormData(prev => ({
      ...prev,
      eventLocation: location.display_name
    }));
    setLocations([]); // Clear suggestions
  };

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
      if (
        notificationRef.current && 
        event.target instanceof Node &&
        !notificationRef.current.contains(event.target)
      ) {
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
          <div 
            ref={notificationRef}
            className="relative"
          >
            {/* Notification-related content can go here if needed */}
          </div>

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
            <input
              type="text"
              name="eventLocation"
              value={formData.eventLocation}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded text-black"
              placeholder="Enter location"
            />
            {locations.length > 0 && (
              <div className="absolute z-10 w-full bg-white border border-gray-300 rounded text-black mt-1 shadow-lg">
                {locations.map((location, index) => (
                  <div 
                    key={index} 
                    onClick={() => selectLocation(location)}
                    className="p-2 text-black hover:bg-indigo-300 cursor-pointer"
                  >
                    {location.display_name}
                  </div>
                ))}
              </div>
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