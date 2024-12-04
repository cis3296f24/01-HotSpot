"use client";
import { useRouter } from "next/navigation";
import Search from './searchBar';
import EventCatalog from './eventCatalog/page';
import NavBar from "@/app/NavBar"; 

export default function Home() {
  const router = useRouter();

  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />

      <main className="flex-grow flex items-center justify-center">
        <div className="flex flex-col space-y-4 mb-12 mr-auto">
        <h1 className="relative text-6xl font-bold text-white ml-5 animate-flipIn">
          <span className="absolute inset-0 -translate-x-1 translate-y-1 text-[#2A3C73] blur-sm">
            Welcome to HOTSPOT
          </span>
          <span className="relative">Welcome to HOTSPOT</span>
        </h1>
          <Search />
        </div>
        <EventCatalog />
      </main>
    </div>
  );
}
