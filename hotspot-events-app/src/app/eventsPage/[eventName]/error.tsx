// app/eventsPage/[eventName]/error.tsx
'use client';
 
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
 
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const router = useRouter();

  useEffect(() => {
    console.error(error);
  }, [error]);
 
  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-100 to-purple-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow-2xl text-center">
        <h2 className="text-xl font-semibold text-red-600">Something went wrong!</h2>
        <div className="mt-4 space-y-2">
          <button
            onClick={() => reset()}
            className="bg-indigo-500 text-white px-6 py-2 rounded-lg hover:bg-indigo-600 transition-colors mr-2"
          >
            Try again
          </button>
          <button
            onClick={() => router.back()}
            className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors"
          >
            Go back
          </button>
        </div>
      </div>
    </div>
  );
}