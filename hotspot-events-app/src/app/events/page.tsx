// src/app/events/page.tsx

"use client";
import { useState, useEffect } from "react"; 
import NavBar from "@/app/NavBar"; 
import { useRouter } from "next/navigation";
import Registration from '@/app/Reg';
import { auth } from "@/app/firebase";
import { onAuthStateChanged } from "firebase/auth";

//Firebase
import { db } from '@/app/firebase';
import { collection, addDoc } from "firebase/firestore";
import EventCreationForm from "@/formComponent/page";


export default function Events() {
  const [events, setEvents] = useState([]);
  const [formData, setFormData] = useState({
    eventName: "",
    eventDate: "",
    eventTime: "",
    eventLocation: "",
  });

  const [isRegistered, setIsRegistered] = useState(false);
  const router = useRouter();

  // Listen to the authentication state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsRegistered(true); // User is logged in
      } else {
        setIsRegistered(false); // User is not logged in
      }
    });

    return () => unsubscribe(); // Clean up the listener on unmount
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const sendEmail = async (eventDetails) => {
    try {
      const response = await fetch("/api/sendEmail", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(eventDetails),
      });
  
      const result = await response.json();
  
      if (response.ok) {
        console.log("API Response:", result);
      } else {
        console.error("API Error:", result);
      }
    } catch (error) {
      console.error("Error sending email:", error);
      alert("Failed to send email notification. Please check the log for more details.");
    }
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Event Details:", formData);

    try {
      const docRef = await addDoc(collection(db, "events"), formData);
      console.log("Document written with ID: ", docRef.id);

      await sendEmail(formData);

      alert("Event created successfully!");

      setFormData({
        eventName: "",
        eventDate: "",
        eventTime: "",
        eventLocation: "",
      });
    } catch (error) {
      console.error("Error adding document: ", error);
      alert("Failed to create event. Please try again.");
    }
  };

   // If the user is not registered (not logged in), show the registration page
  if (!isRegistered) {
    return <Registration onRegister={() => setIsRegistered(true)} />;
  }


  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />

      <div className="flex flex-1 justify-center items-center">
        <EventCreationForm/>
      </div>
    </div>
  );
}
