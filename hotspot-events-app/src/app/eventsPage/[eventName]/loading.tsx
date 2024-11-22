export default function Loading() {
        return (
          <div className="min-h-screen bg-gradient-to-r from-indigo-100 to-purple-100 flex items-center justify-center delay-500">
            <div className="bg-white p-8 rounded-xl shadow-2xl">
              <div className="animate-spin rounded-full h-13 w-13 border-b-2 border-indigo-500 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading event details...</p>
            </div>
          </div>
        );
      }