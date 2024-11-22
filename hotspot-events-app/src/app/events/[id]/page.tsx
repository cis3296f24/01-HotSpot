"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { db } from "@/app/firebase";
import { doc, getDoc } from "firebase/firestore";
import { FaCalendarAlt, FaClock, FaMapMarkerAlt, FaArrowLeft } from "react-icons/fa";

export default function EventDetails() {
  const { id } = useParams();
  const router = useRouter(); 
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvent = async () => {
      if (!id) {
        console.error("Event ID is missing or undefined");
        return;
      }

      setLoading(true);
      try {
        const eventRef = doc(db, "events", id); 
        const eventSnap = await getDoc(eventRef);

        if (eventSnap.exists()) {
          setEvent(eventSnap.data());
        } else {
          console.error("No such event!");
        }
      } catch (error) {
        console.error("Error fetching event details:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchEvent();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg text-[#3D52A0]">Loading...</p>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg text-red-500">Event not found!</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
        {/* Back Button */}
        <button
          onClick={() => router.back()} 
          className="card-text flex items-center gap-2 p-3 text-white rounded-full shadow-md hover-gradient transition-all mt-6 ml-6 mb-4"
        >
          <FaArrowLeft />
          <span>Back to Events</span>
        </button>

        {/* Banner Section */}
        <div className="relative">
          <div className="h-48 bg-gradient-to-r from-[#3D52A0] to-[#7091E6]"></div>
          <h1 className="absolute bottom-4 left-4 text-4xl font-bold events-text text-white drop-shadow-lg">
            {event.eventName}
          </h1>
        </div>

        {/* Event Details Section */}
        <div className="p-8">
          <div className="text-gray-700 card-text text-lg space-y-4">
            <div className="flex items-center space-x-4">
              <FaCalendarAlt className="text-[#3D52A0] text-xl" />
              <p>
                <strong>Date:</strong> {event.eventDate}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <FaClock className="text-[#3D52A0] text-xl" />
              <p>
                <strong>Time:</strong> {event.eventTime}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <FaMapMarkerAlt className="text-[#3D52A0] text-xl" />
              <p>
                <strong>Location:</strong> {event.eventLocation}
              </p>
            </div>
          </div>
        </div>

        {/* Add to calendar button. Can maybe make this send out an email later */}
        <div className="bg-[#3D52A0] text-white py-6 px-8">
          <h2 className="text-2xl welcome-text mb-2">Get Ready for the Event!</h2>
          <p className="text-white/80 mb-4 welcome-text">
            Mark your calendar! We can't wait to see you there!
          </p>
          <button className="hover-gradient px-6 py-3 rounded-full text-lg font-semibold shadow-md">
            Add to My Calendar
          </button>
        </div>
      </div>
    </div>
  );
}
