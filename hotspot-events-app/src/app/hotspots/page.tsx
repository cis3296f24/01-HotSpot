"use client";

import NavBar from "@/app/NavBar";

export default function BlankPage() {
  const hotspots = [
    { name: "Rittenhouse Square", image: "/images/rittenhouse.jpg" },
    { name: "The Wall", image: "/images/theWall.jpeg" },
    { name: "City Hall", image: "/images/cityHall.jpg" },
    { name: "Bell Tower", image: "/images/bellTower.jpg" },
  ];

  return (
    <div className="flex flex-col min-h-screen text-gray-900">
      <NavBar />

      <div className="flex justify-center items-center mt-8">
        <h1
          className="text-5xl tracking-wide welcome-text text-[#3D52A0]"
          style={{
            
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
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
