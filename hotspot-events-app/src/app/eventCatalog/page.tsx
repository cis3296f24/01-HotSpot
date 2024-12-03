"use client";

import { useState, useEffect } from "react";
import { db } from '@/app/firebase';
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { format } from 'date-fns';
import { FaCalendarAlt, FaClock, FaMapMarkerAlt, FaHeart, FaRegHeart, FaFire } from 'react-icons/fa';
import Link from "next/link";

interface Event {
    id: string;
    eventName: string;
    eventDate: string;
    eventTime: string;
    eventLocation: string;
    isFavorited?: boolean;
    trendingCount: number;
}

export default function EventCatalog() {
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEvents = async () => {
            setLoading(true);
            try {
                const querySnapshot = await getDocs(collection(db, "events"));
                const eventsData = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                    trendingCount: doc.data().trendingCount || 0,
                    isFavorited: false,
                })) as Event[];

                setEvents(eventsData);
            } catch (error) {
                console.error("Error fetching events: ", error);
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, []);

    const toggleFavorite = (eventId: string) => {
        setEvents((prevEvents) =>
            prevEvents.map((event) =>
                event.id === eventId ? { ...event, isFavorited: !event.isFavorited } : event
            )
        );
    };

    const handleTrendingClick = async (eventId: string) => {
        setEvents((prevEvents) => {
            const updatedEvents = prevEvents.map((event) => {
                if (event.id === eventId) {
                    const updatedEvent = { ...event, trendingCount: event.trendingCount + 1 };
                    updateDoc(doc(db, "events", eventId), {
                        trendingCount: updatedEvent.trendingCount,
                    }).catch((error) => {
                        console.error("Error updating trending count: ", error);
                    });
                    return updatedEvent;
                }
                return event;
            });
            return updatedEvents;
        });
    };

    function formatDate(dateStr: string) {
        const date = new Date(dateStr);
        return format(date, 'MMMM d, yyyy');
    }

    function formatTime(timeStr: string) {
        const time = new Date(`1970-01-01T${timeStr}:00`);
        return format(time, 'h:mm a');
    }

    const sortedEvents = [...events].sort((a, b) => {
        // Favorited events should come before non-favorited events
        if (a.isFavorited && !b.isFavorited) {
            return -1;
        } else if (!a.isFavorited && b.isFavorited) {
            return 1;
        } else if (!a.isFavorited && !b.isFavorited) {
            // Sort non-favorited events by trending count in descending order
            return b.trendingCount - a.trendingCount;
        } else {
            return 0;
        }
    });

    return (
        <div className="p-6 min-h-screen">
            <h2 className="events-text text-3xl font-bold text-center mb-8 text-[#3D52A0]">
                Upcoming Events
            </h2>

            {loading ? (
                <div className="flex justify-center items-center h-40">
                    <p className="text-[#3D52A0]">Loading events...</p>
                </div>
            ) : events.length === 0 ? (
                <p className="text-center text-lg font-medium text-gray-600">
                    No events available
                </p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {sortedEvents.map((event) => (
                        <div
                            key={event.id}
                            className="event-card min-w-[200px] bg-[#e2dbe8] shadow-lg rounded-xl p-6 relative transition-all duration-300 ease-in-out pb-8 transform hover:scale-105 hover:shadow-2xl"
                        >
                            {/* Header with Icon */}
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="card-text text-lg font-semibold text-[#3D52A0]">
                                    {event.eventName}
                                </h3>

                                {/* Favorite Button */}
                                <button onClick={() => toggleFavorite(event.id)}>
                                    {event.isFavorited ? (
                                        <FaHeart className="text-[#ee9a40] text-xl" />
                                    ) : (
                                        <FaRegHeart className="text-gray-400 text-xl" />
                                    )}
                                </button>
                            </div>

                            {/* Date & Time */}
                            <div className="text-gray-500 card-text text-sm">
                                <p>
                                    <FaCalendarAlt className="inline-block mr-2 text-[#7091E6]" /> {formatDate(event.eventDate)}
                                </p>
                                <p>
                                    <FaClock className="inline-block mr-2 text-[#7091E6]" /> {formatTime(event.eventTime)}
                                </p>
                                <p>
                                    <FaMapMarkerAlt className="inline-block mr-2 text-[#7091E6]" /> {event.eventLocation}
                                </p>
                            </div>

                            {/* Button to View Details */}
                            <div className="mt-4">
                                <Link href={`/events/${event.id}`}>
                                    <button className="card-text w-full py-2 text-white rounded-full hover-gradient">
                                        View Details
                                    </button>
                                </Link>
                            </div>

                            {/* Trending - Fire Icon for trending events */}
                            <div className="absolute bottom-2 left-2 flex items-center z-10">
                                <button
                                    onClick={() => handleTrendingClick(event.id)}
                                    className={`flex items-center ${event.trendingCount >= 10 ? 'text-red-600 animate-flame' : event.trendingCount >= 5 ? 'text-orange-500 animate-pulse' : 'text-gray-500'}`}
                                >
                                    <FaFire className={`transition-all ${event.trendingCount >= 10 ? 'text-red-600' : event.trendingCount >= 5 ? 'text-orange-500' : 'text-gray-500'}`} />
                                    <span className="ml-2">{event.trendingCount}</span>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
