import React, { useState, useEffect } from "react";
import { FaSearch } from 'react-icons/fa'; 
import { collection, getDocs } from "firebase/firestore"; // functions to connect to db and fetch
import { db } from "./firebase";

export default function Search(){
        const [searchItem, setSearch] = useState("");  // for settng new input value
        const [isLoaded, setIsLoaded] = useState(false); // for animation slide
        const [searchSuggestions, setSearchSuggestions] = useState<string[]>([]); // arry of str, list of search suggestions
        const [TotalEvents, setTotalEvents] = useState<string[]>([]); // for updating events

        // const ExampleSuggestions = ["Event 1", "Event 2", "Study Group", "Bike Events", "Event 4", "Event 5"]; // dummy vals for testing

        useEffect(() => { // leverage useEffect to load 
                setIsLoaded(true); // Trigger the animation on component load

                // Fetch events from Firestore
                const fetchEvents = async () => {
                const querySnapshot = await getDocs(collection(db, "events")); // get all events from db
                const eventNames: string[] = []; // string array to store "eventName" from db
                querySnapshot.forEach((doc) => { // iterate through doc & get eventnName
                        const eventName = doc.data().eventName;
                        if (eventName) {
                                eventNames.push(eventName); // add "eventName" to the db
                        }
                });
                setTotalEvents(eventNames); // store fetched "eventName" in state
        };

                fetchEvents().catch(console.error); // to catch errors
        }, [db]);

        const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => { // whenever the input field changes
                const val = e.target.value;
                setSearch(e.target.value); // current value of input, update searchState with new value
                if (val) {
                        const filter = TotalEvents.filter((item) => 
                            item.toLowerCase().includes(val.toLowerCase()) // return new array. Check if val is a subtring of item, also case sensitive
                        );
                        setSearchSuggestions(filter);
                } else {
                        setSearchSuggestions([]); // no sugggestion if input is empty
                }
        };
      
        const onSearch = () => { // when search button is clicked
                console.log("Search", searchItem); // log item to the console
        };
      
        return (
                <div className={`max-w-lg p-4 space-y-6 ${isLoaded ? 'animate-slide-in' : ''}`}>
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
                                {searchItem && searchSuggestions.length > 0 && ( // only render if there's no empty string
                                <div className="bg-white border-t-0 border border-gray-300 rounded-lg shadow-md mt-1 bg-gradient-to-r from-white to-indigo-200">
                                        <ul className="divide-y divide-gray-200">
                                                {searchSuggestions.map((item, index) => ( // a key for each list item 
                                                        <li
                                                                key={index} // key to identify each element
                                                                className="p-2 text-black hover:bg-indigo-300 cursor-pointer"
                                                                onClick={() => setSearch(item)} // when the user clicked, input field will change
                                                        >
                                                                {item}
                                                        </li>
                                                ))}
                                        </ul>
                                </div>
                                )}
                        </div>
                </div>
        );
};
