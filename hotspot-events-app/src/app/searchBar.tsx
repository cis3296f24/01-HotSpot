"use client";
import React, { useState, useEffect, useCallback } from "react";
import { FaSearch } from 'react-icons/fa'; 
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/app/firebase";
import { useRouter } from "next/navigation";
import Link from "next/link";


// Define an interface for Event to have more structured data
interface Event {
  id: string;
  eventName: string;
  date: string;
  time: string;
  location: string;
}

export default function Search(){
  const [searchItem, setSearch] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);
  const [searchSuggestions, setSearchSuggestions] = useState<Event[]>([]); 
  const [totalEvents, setTotalEvents] = useState<Event[]>([]); 
  const router = useRouter();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setIsLoaded(true);
        const querySnapshot = await getDocs(collection(db, "events"));
        const eventDetails: Event[] = [];

        querySnapshot.forEach((document) => {
          const data = document.data();
          eventDetails.push({
            id: document.id,
            eventName: data.eventName,
            date: data.date || '',
            time: data.time || '',
            location: data.location || '',
          });
        });

        setTotalEvents(eventDetails);
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        // setIsLoaded(false);
      }
    };

    fetchEvents();
  }, []); 

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearch(val);
    
    if (val.trim()) {
      const filter = totalEvents.filter((event) => 
        event.eventName.toLowerCase().includes(val.toLowerCase())
      );
      setSearchSuggestions(filter);
    } else {
      setSearchSuggestions([]);
    }
  };

  

  const onSearch = () => {
    console.log("Search", searchItem);
  };


  // const handleItemClick = (eventName: string) => {
  //   // Find the full event details
  //   const selectedEvent = totalEvents.find(event => event.eventName === eventName);
    
  //   if (selectedEvent) {
  //     // // Create query parameters manually to ensure all details are passed
  //     // const queryParams = new URLSearchParams({
  //     //   date: selectedEvent.date || '',
  //     //   time: selectedEvent.time || '',
  //     //   location: selectedEvent.location || '',
  //     // }).toString();
      
  //     // router.push(`/eventsPage/${encodeURIComponent(eventName)}`); // before from my go to /eventsPage/[eventName]/page.tsx
  // };

  const handleItemClick = (eventId: string) => {
    router.push(`/events/${eventId}`);
    setSearch(""); // Clear search after selection
    setSearchSuggestions([]); // Clear results after selection
  };
  
  return (
    <div className={`max-w-lg p-4 space-y-6 overflow-visible ${isLoaded ? 'animate-slide-in' : ''}`}>
      <div className="relative w-2/3 ml-3">
        <div className="relative">
          <input
            type="text"
            placeholder="Search Events..."
            value={searchItem}
            onChange={handleSearch}
            onKeyDown={(e) => {
              if (e.key === "Enter") {onSearch();}
            }}
            className="w-full p-2 text-black focus:outline-none focus:ring-2 focus:ring-blue-400 rounded-lg bg-gradient-to-r from-white to-indigo-200"
            required
          />
          <button
            onClick={onSearch}
            className="absolute right-2 top-1/2 transition-transform transform hover:scale-105 -translate-y-1/2 p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600"
          >
            <FaSearch />
          </button>
        </div>

        {/* Dropdown*/}
        {searchItem && searchSuggestions.length > 0 && (
          <div className="bg-white border-t-0 border border-gray-300 rounded-lg shadow-md mt-1 bg-gradient-to-r from-white to-indigo-200">
            <ul className="divide-y divide-gray-200">
              {searchSuggestions.map((event) => (
                <li
                  key={event.id} // Use unique event ID as the key
                  className="p-2 text-black hover:bg-indigo-300 cursor-pointer"
                  onClick={() => handleItemClick(event.id)}
                >
                  {event.eventName}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}