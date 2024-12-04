"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { db } from "@/app/firebase";
import { doc, getDoc } from "firebase/firestore";
import { FaCalendarAlt, FaClock, FaMapMarkerAlt, FaArrowLeft } from "react-icons/fa";

// OpenLayer API stuff
import "ol/ol.css";
import Map from "ol/Map";
import View from "ol/View";
import { Tile as TileLayer } from "ol/layer";
import { OSM } from "ol/source";
import { fromLonLat } from "ol/proj";
import Feature from "ol/Feature";
import Point from "ol/geom/Point";
import { Icon, Style } from "ol/style";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";

export default function EventDetails() {
  const { id } = useParams();
  const router = useRouter();
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [coordinates, setCoordinates] = useState<[number, number] | null>(null);

  useEffect(() => {
    const fetchEvent = async () => {
      if (!id) {
        console.error("Event ID is missing or undefined");
        return;
      }

      setLoading(true);
      try {
        const eventRef = doc(db, "events", id);
        const eventSnap = await getDoc(eventRef);

        if (eventSnap.exists()) {
          const eventData = eventSnap.data();
          setEvent(eventData);

          // Fetch coordinates using Nominatim
          const geocodeResponse = await fetch(
            `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(eventData.eventLocation)}&format=json`
          );
          const geocodeData = await geocodeResponse.json();

          if (geocodeData.length > 0) {
            const { lon, lat } = geocodeData[0];
            setCoordinates([parseFloat(lon), parseFloat(lat)]);
          } else {
            console.error("No coordinates found for the location.");
          }
        } else {
          console.error("No such event!");
        }
      } catch (error) {
        console.error("Error fetching event details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  useEffect(() => {
    let map: Map | undefined;
    if (coordinates) {
      // Initialize the OpenLayers map
      map = new Map({
        target: "map",
        layers: [
          new TileLayer({
            source: new OSM(),
          }),
        ],
        view: new View({
          center: fromLonLat(coordinates),
          zoom: 16,
        }),
      });

      // Add a pin (marker) to the map at the event location
      const marker = new Feature({
        geometry: new Point(fromLonLat(coordinates)),
      });
      marker.setStyle(
        new Style({
          image: new Icon({
            src: "https://openlayers.org/en/v4.6.5/examples/data/icon.png", // Icon from OpenLayer
            scale: 1.2,
          }),
        })
      );

      // Add the marker to a vector layer
      const vectorLayer = new VectorLayer({
        source: new VectorSource({
          features: [marker],
        }),
      });

      map.addLayer(vectorLayer);
    }

    // Cleanup the map on component unmount
    return () => {
      if (map) {
        map.setTarget(undefined);
      }
    };
  }, [coordinates]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg text-[#3D52A0]">Loading...</p>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg text-red-500">Event not found!</p>
      </div>
    );
  }

  const handleAddToCalendar = () => {
    const { eventName, eventDate, eventTime, eventLocation } = event;
  
    // Create a Date object for the event
    const startDate = new Date(`${eventDate} ${eventTime}`);
    const endDate = new Date(startDate.getTime() + 60 * 60 * 1000);
  
    // Generate .ics content
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'BEGIN:VEVENT',
      `SUMMARY:${eventName}`,
      `DTSTART:${startDate.toISOString().replace(/[-:]/g, '').split('.')[0]}`,
      `DTEND:${endDate.toISOString().replace(/[-:]/g, '').split('.')[0]}`,
      `LOCATION:${eventLocation}`,
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\n');
  
    // Create Blob and file URL
    const blob = new Blob([icsContent], { type: 'text/calendar' });
    const fileUrl = URL.createObjectURL(blob);
  
    // Create temporary link and trigger download
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = `${eventName}.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  
    // download .ics file to open the calendar app
    alert('Please open the downloaded .ics file to add the event to your calendar!');
  };


  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-400 animate-gradient-flow bg-gradient-size flex flex-col items-center justify-center p-6 shadow-2xl">
      <div className="max-w-4xl w-full mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
        <button
          onClick={() => router.back()}
          className="absolute top-4 left-4 h-10 w-11 mr-3 bg-blue-500 text-white p-2 rounded-full hover:bg-[#3D52A0] flex items-center justify-center focus:ring-2 focus:ring-blue-400"
        >
          <FaArrowLeft className="text-xl" />
        </button>

        {/* Map Section */}
        <div id="map-container" className="w-full h-96 relative">
          <div id="map" className="h-full w-full"></div>
        </div>

        {/* Event Details Section */}
        <div className="p-8">
          <h1 className="text-4xl font-bold events-text text-[#3D52A0] drop-shadow-lg mb-4">
            {event.eventName}
          </h1>
          <div className="text-gray-700 card-text text-lg space-y-4">
            <div className="flex items-center space-x-4">
              <FaCalendarAlt className="text-[#3D52A0] text-xl" />
              <p>
                <strong>Date:</strong> {event.eventDate}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <FaClock className="text-[#3D52A0] text-xl" />
              <p>
                <strong>Time:</strong> {event.eventTime}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <FaMapMarkerAlt className="text-[#3D52A0] text-xl" />
              <p>
                <strong>Location:</strong> {event.eventLocation}
              </p>
            </div>
          </div>
        </div>

        {/* Add to Calendar Section */}
        <div className="w-full bg-gradient-to-r from-[#3D52A0] to-[#7091E6] text-white py-6 px-8">
          <h2 className="text-2xl welcome-text mb-2">Get Ready for the Event!</h2>
          <p className="text-white/80 mb-4 welcome-text">
            Mark your calendar! We can't wait to see you there!
          </p>
          <button
            className="hover-gradient px-6 py-3 rounded-full text-lg font-semibold shadow-md"
            onClick={handleAddToCalendar}
          >
            Add to My Calendar
          </button>
        </div>
      </div>
    </div>
  );
}
