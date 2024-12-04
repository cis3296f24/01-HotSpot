// src/app/profile/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Registration from "../Reg";
import NavBar from "@/app/NavBar";
import { auth } from "@/app/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";

export default function Profile() {
  const [isRegistered, setIsRegistered] = useState(false);
  const [name, setName] = useState("");
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(false); 
  const [saveMessage, setSaveMessage] = useState("");
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in
        setIsRegistered(true); // Set registration state to true
      } else {
        // User is not signed in, redirect to registration/sign-in
        setIsRegistered(false);
      }
    });

    const savedName = sessionStorage.getItem("name");
    const savedPicture = sessionStorage.getItem("profilePicture");

    if (savedName) {
       setName(savedName);
    }
    if (savedPicture) {
      setPreview(savedPicture);
    }
    return () => unsubscribe(); // Clean up the listener on unmount
  }, []);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfilePicture(file);
      const imageURL = URL.createObjectURL(file);
      setPreview(imageURL);

      
      // Save the image URL temporarily in sessionStorage
      sessionStorage.setItem("profilePicture", imageURL);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Save name and profile picture in sessionStorage
    sessionStorage.setItem("name", name);

    // Show the save confirmation message
    setSaveMessage("Profile saved successfully!");
    setIsSaved(true);

    // Clear the confirmation message after a few seconds
    setTimeout(() => {
      setSaveMessage("");
      setIsSaved(false);
    }, 3000);


    // Add server/API send
    console.log("User Name:", name);
    console.log("Profile Picture:", profilePicture);
  };
  
  const handleRegistrationComplete = () => {
    setIsRegistered(true);
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth); // Sign out user

      sessionStorage.removeItem("name");
      sessionStorage.removeItem("profilePicture");

      setName("");
      setProfilePicture(null);
      setPreview(null)

      router.push("/"); // Redirect to homepage after sign out
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  // Render the Registration component if the user is not registered
  if (!isRegistered) {
    return <Registration onRegister={handleRegistrationComplete} />;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />

      <div className="flex flex-col items-center justify-center flex-1">
        <h1 className="text-4xl font-bold mb-4">Profile Page</h1>
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md w-full max-w-md space-y-6">

          {/* Profile Picture Preview at the top */}
          <div className="flex justify-center mb-4">
            {preview ? (
              <img
                src={preview}
                alt="Profile Preview"
                className="w-32 h-32 object-cover rounded-full"
              />
            ) : (
              <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center text-gray-400">
                No Image
              </div>
            )}
          </div>

          {/* Profile Picture Input */}
          <div>
            <label className="block text-gray-700 mb-2">Change Profile Picture</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>

          {/* Name Input */}
          <div>
            <label className="block text-gray-700 mb-2">Name</label>
            <input
              type="text"
              value={name}
              onChange={handleNameChange}
              className="w-full p-2 border border-gray-300 rounded text-black"
              placeholder="Enter your name"
              required
            />
          </div>

          {/* Save Confirmation Message */}
          {saveMessage && (
            <div className="mt-4 text-green-500 text-xl font-semibold">
              {saveMessage}
            </div>
          )}

          {/* Submit and Sign Out Buttons */}
          <div className="flex flex-col space-y-4">
            <button
              type="submit"
              className="w-full bg-blue-500 text-white font-bold py-2 rounded hover:bg-blue-600 transition duration-200"
            >
              Save Profile
            </button>

            <button
              onClick={handleSignOut}
              className="w-full bg-red-500 text-white font-bold py-2 rounded hover:bg-red-600 transition duration-200"
            >
              Sign Out
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}