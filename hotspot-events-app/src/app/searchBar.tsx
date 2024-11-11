import React, { useState, useEffect } from "react";
import { FaSearch } from 'react-icons/fa'; 

export default function Search(){
        const [searchItem, setSearch] = useState("");  // for hook
        const [isLoaded, setIsLoaded] = useState(false);

        useEffect(() => {
                setIsLoaded(true); // Trigger the animation on component load
        }, []);

        const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => { // whenever the input field changes
                setSearch(e.target.value); // current value of input, update searchState with new value
        };
      
        const onSearch = () => { // when search button is clicked
                console.log("Search", searchItem); // log item to the console
        };
      
        return (
                <div className={`max-w-lg p-4 space-y-6" ${isLoaded ? 'animate-slide-in' : ''}`}>
                        <div className="flex space-x-2 ml-3 mb-12">
                                <input
                                        type="text"
                                        placeholder="Search Events..."
                                        value={searchItem}
                                        onChange={handleSearch}
                                        onKeyDown={(e) =>{
                                                if(e.key === "Enter"){onSearch();}
                                        }}
                                        className="w-2/3 p-2 border rounded-full text-black drop-shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gradient-to-r from-white to-indigo-100"
                                        required      
                                />
                                <button
                                        onClick={onSearch}
                                        className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-transform transform hover:scale-105"
                                >
                                <FaSearch/>
                                </button>
                        </div>
                </div>
        );
};
