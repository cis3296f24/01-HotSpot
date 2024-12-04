// src/app/profile/page.tsx
"use client";
import { FaHome, FaCalendarAlt, FaBell, FaUser } from 'react-icons/fa';
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Registration from "@/app/register/page";
import NavBar from "@/app/NavBar";
import { db, auth } from "@/app/firebase";
import { onAuthStateChanged, updateProfile, signOut } from "firebase/auth";

export default function Profile() {
  const [IsAuthenticated, setIsAuthenticated] = useState(false);
  const [name, setName] = useState("");
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const storedPicture = sessionStorage.getItem("profilePicture");
    if (storedPicture) {
      setPreview(storedPicture); // Set the preview if the image was stored in the session
    }
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuthenticated(true); // User is logged in
        setName(user.displayName || "");
      } else {
        setIsAuthenticated(false); // User is not logged in
        router.push("/register"); 
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfilePicture(file);

      const filePreview = URL.createObjectURL(file);
      setPreview(filePreview);
      sessionStorage.setItem("profilePicture", filePreview); 
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle saving data
    console.log("User Name:", name);
    console.log("Profile Picture:", profilePicture);
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth); // Firebase sign-out
      router.push("/register"); // Redirect to login page after sign-out
    } catch (error) {
      console.error("Sign out error: ", error);
    }
  };
  
  if (!IsAuthenticated) {
    return null; // Prevent rendering while checking auth state
  }

  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />

      <div className="flex flex-col items-center justify-center flex-1">
        <h1 className="text-4xl font-bold mb-4">Profile Page</h1>
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md w-full max-w-md space-y-4">
          
          {/* Name Input */}
          <div>
            <label className="block text-gray-700">Name</label>
            <input
              type="text"
              value={name}
              onChange={handleNameChange}
              className="w-full p-2 border border-gray-300 rounded text-black"
              placeholder="Enter your name"
              required
            />
          </div>
          
          {/* Profile Picture Input */}
          <div>
            <label className="block text-gray-700">Profile Picture</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>

          {/* Preview Image */}
          {preview && (
            <div className="mt-4">
              <img
                src={preview}
                alt="Profile Preview"
                className="w-32 h-32 object-cover rounded-full mx-auto"
              />
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white font-bold py-2 rounded hover:bg-blue-600 transition duration-200"
          >
            Save Profile
          </button>
        </form>

        {/* Sign Out Button */}
        <div className="mt-4">
          <button
            onClick={handleSignOut}
            className="bg-red-500 text-white font-bold py-2 px-4 rounded hover:bg-red-600 transition duration-200"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}
