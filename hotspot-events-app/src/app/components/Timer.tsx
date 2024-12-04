import { useEffect, useState } from "react";

interface TimerProps {
  eventDateTime: string;
}

export default function Timer({ eventDateTime }: TimerProps) {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const targetDate = new Date(eventDateTime);

    const updateCountdown = () => {
      const now = new Date();
      const difference = targetDate.getTime() - now.getTime();

      if (difference <= 0) {
        setTimeLeft("Event has started!");
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / (1000 * 60)) % 60);
      const seconds = Math.floor((difference / 1000) % 60);

      setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`);
    };

    const intervalId = setInterval(updateCountdown, 1000);
    updateCountdown();

    return () => clearInterval(intervalId);
  }, [eventDateTime]);

  return (
    <div className="fixed bottom-4 right-4 bg-white p-4 shadow-lg rounded-lg border border-gray-300 text-center">
      <p className="text-gray-700 text-sm font-semibold">Time Left Until Event</p>
      <p className="text-xl font-bold text-[#3D52A0]">{timeLeft}</p>
    </div>
  );
}
