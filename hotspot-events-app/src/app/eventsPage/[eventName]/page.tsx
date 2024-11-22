"use client";
import React, { Suspense, useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { db } from '@/app/firebase';
import { collection, query, where, getDocs } from "firebase/firestore";
import { FaArrowAltCircleLeft, FaClock } from 'react-icons/fa';
import { FaCalendar, FaMapLocationDot, FaPerson } from 'react-icons/fa6';
import { format } from 'date-fns';
import { useRouter } from "next/navigation";
import Loading from './loading';

interface Event {
  eventName: string;
  eventDate: string;
  eventTime: string;
  eventLocation: string;
}

function EventContent() {
  const params = useParams();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null); // for error handling
  const router = useRouter();

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        setLoading(true); // Set loading to true at the start
        const eventName = decodeURIComponent(params.eventName as string);
        console.log('Fetching event name:', eventName); 

        const q = query(
          collection(db, "events"), 
          where("eventName", "==", eventName),
        );

        const querySnapshot = await getDocs(q);
        
        if (!querySnapshot.empty) {
          const eventData = querySnapshot.docs[0].data() as Event;
          console.log('Event data found:', eventData); // Debug log
          setEvent(eventData);
        } else {
          setEvent(null); // Explicitly set to null if no event found
        }
      } catch (error) {
        console.error("Error fetching event details:", error);
        setEvent(null);
      } finally {
        setLoading(false); // Set loading to false when done
      }
    };


    console.log('Effect running, params:', params.eventName); // Debug log
    if (params.eventName) {  // Only fetch if have an eventName
      fetchEventDetails();
    }
    else{
      setLoading(false)
    }
  }, [params.eventName]);
  const handleGoBack = () => {
    router.back();
  }

  const formatDate = (dateStr: string) => {
    return format(new Date(dateStr), 'MMMM d, yyyy');
  };

  const formatTime = (timeStr: string) => {
    return format(new Date(`1970-01-01T${timeStr}:00`), 'h:mm a');
  };

    if (loading) {
      return (
        <div className="min-h-screen bg-gradient-to-r from-indigo-100 to-purple-200 flex items-center justify-center">
          <div className="bg-white p-8 rounded-xl shadow-2xl">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading event details...</p>
          </div>
        </div>
      );
    }
    if (error) {
      return (
        <div className="min-h-screen bg-gradient-to-r from-indigo-100 to-purple-100 flex items-center justify-center">
          <div className="bg-white p-8 rounded-xl shadow-2xl text-center">
            <p className="text-xl text-red-600">{error}</p>
            <button
              onClick={() => router.back()}
              className="mt-4 bg-indigo-500 text-white px-6 py-2 rounded-lg hover:bg-indigo-600 transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
      );
    }

    if (!event) {
      return (
        <div className="min-h-screen bg-gradient-to-r from-indigo-100 to-purple-100 flex items-center justify-center">
          <div className="bg-white p-8 rounded-xl shadow-2xl text-center">
            <p className="text-xl text-gray-700">No event found</p>
            <button
              onClick={() => router.back()}
              className="mt-4 bg-indigo-500 text-white px-6 py-2 rounded-lg hover:bg-indigo-600 transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
      );
    }

    return (
      // <div className="min-h-screen bg-gradient-to-r from-indigo-100 to-purple-100 flex items-center justify-center p-4">
      <div className="min-h-screen bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-400 animate-gradient-flow bg-gradient-size flex items-center justify-center p-4">

        <button
            onClick={handleGoBack}
            className="absolute top-4 left-4 bg-blue-500 text-white p-2 rounded-full hover:bg-blue-700 flex items-center focus:ring-2 focus:ring-blue-400"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-7 w-7 mr-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
          </button>
        
        <div className="bg-white shadow-2xl rounded-xl overflow-hidden w-full max-w-2xl relative">
        
          
          {/* Event Details */}
          <div className="p-6 space-y-6">
            <h1 className="text-4xl font-bold text-indigo-800 mb-4">{event.eventName}</h1>

            <div className="grid md:grid-cols-2 gap-4">
              {/* Left Column */}
              <div className="space-y-4">
                <div className="flex items-center">
                  <FaCalendar className="inline-block mr-4 text-[#7091E6] w-6 h-6" />
                  <div>
                    <span className="font-semibold text-gray-700">Date:</span>
                    <p className="text-gray-600">{formatDate(event.eventDate)}</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <FaClock className="inline-block mr-4 text-[#7091E6] w-6 h-6" />
                  <div>
                    <span className="font-semibold text-gray-700">Time:</span>
                    <p className="text-gray-600">{formatTime(event.eventTime)}</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <FaMapLocationDot className="inline-block mr-4 text-[#7091E6] w-6 h-6" />
                  <div>
                    <span className="font-semibold text-gray-700">Location:</span>
                    <p className="text-gray-600">{event.eventLocation}</p>
                  </div>
                </div>
              </div>

            </div>

          </div>
        </div>
      </div>
    );
}


export default function Page() {
  return (
    <Suspense fallback={<Loading />}>
      <EventContent />
    </Suspense>
  );
}