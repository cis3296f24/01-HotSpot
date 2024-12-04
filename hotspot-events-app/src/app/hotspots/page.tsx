"use client";

import { useState } from "react";
import NavBar from "@/app/NavBar";
import { FaHeart, FaRegHeart } from "react-icons/fa";

export default function BlankPage() {
  const hotspots = [
    { id: 1, name: "Rittenhouse Square", image: "/images/rittenhouse.jpg" },
    { id: 2, name: "The Wall", image: "/images/theWall.jpeg" },
    { id: 3, name: "City Hall", image: "/images/cityHall.jpg" },
    { id: 4, name: "Bell Tower", image: "/images/bellTower.jpg" },
  ];

  const [likedHotspots, setLikedHotspots] = useState<number[]>([]);

  const toggleLike = (id: number) => {
    setLikedHotspots((prevLiked) =>
      prevLiked.includes(id)
        ? prevLiked.filter((hotspotId) => hotspotId !== id)
        : [...prevLiked, id]
    );
  };


  const sortedHotspots = hotspots.sort((a, b) => {
    const aLiked = likedHotspots.includes(a.id);
    const bLiked = likedHotspots.includes(b.id);

    if (aLiked && !bLiked) return -1;
    if (!aLiked && bLiked) return 1;
    return 0;
  });

  return (
    <div className="flex flex-col min-h-screen text-gray-900">
      <NavBar />

        <div className="flex justify-center items-center mt-8">
        <h1
          className="text-5xl tracking-wide welcome-text text-white"
          style={{
            textShadow: '2px 2px 5px rgba(0, 0, 0, 0.5)', // Adds a black shadow with a subtle blur
            fontWeight: 'bold', // Makes the text bold
            letterSpacing: '0.1em', // Adds slight spacing between letters for a modern look
          }}
        >
          HOTSPOTS
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 p-8 mt-6">
        {hotspots.map((hotspot, index) => (
          <div
            key={index}
            className="relative rounded-lg shadow-lg overflow-hidden bg-gray-800 transform transition-transform hover:scale-105"
          >
            <img
              src={hotspot.image}
              alt={hotspot.name}
              className="w-full h-48 object-cover opacity-90 hover:opacity-100 transition-opacity"
            />
            <div className="absolute top-0 left-0 right-0 bg-black bg-opacity-50 p-4 text-center">
              <h2
                className="text-xl font-bold uppercase tracking-wider text-white"
                style={{
                  fontFamily: "'Poppins', sans-serif",
                }}
              >
                {hotspot.name}
              </h2>

              <button
                onClick={() => toggleLike(hotspot.id)}
                className="absolute top-4 right-4"
              >
                {likedHotspots.includes(hotspot.id) ? (
                  <FaHeart className="text-red-500 text-2xl" />
                ) : (
                  <FaRegHeart className="text-gray-300 text-2xl" />
                )}
              </button>

            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
