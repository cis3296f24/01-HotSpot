import React, {useState} from "react";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "@/app/firebase";
import { auth } from "@/app/firebase"
// props interface
interface RegistrationProps {
  onRegister: () => void; 
}


export default function Registration({ onRegister }: RegistrationProps) {
        const [email, setEmail] = useState("");
        const [password, setPassword] = useState("");
        const [error, setError] = useState<string | null>(null);
        const [isSigningIn, setIsSigningIn] = useState(false); // Toggle between Sign Up and Sign In modes
      
        const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          setEmail(e.target.value);
        };
      
        const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          setPassword(e.target.value);
        };
      
        const handleSubmit = async (e: React.FormEvent) => {
          e.preventDefault();
          setError(null);
      
          try {
            if (isSigningIn) {
              // Sign in with Firebase Authentication
              await signInWithEmailAndPassword(auth, email, password);
              onRegister(); // Notify parent component
            } else {
              // Sign up with Firebase Authentication
              await createUserWithEmailAndPassword(auth, email, password);
              onRegister(); // Notify parent component
            }
          } catch (err: any) {
            if (err.code === "auth/user-not-found") {
              setError("User not found. Please register first.");
            } else if (err.code === "auth/wrong-password") {
              setError("Incorrect password. Please try again.");
            } else if (err.code === "auth/email-already-in-use") {
              setError("This email is already registered. Please sign in instead.");
            } else if (err.code === "auth/invalid-email") {
              setError("Invalid email. Please check the format.");
            } else if (err.code === "auth/weak-password") {
              setError("Password is too weak. It must be at least 6 characters.");
            } else {
              setError("An error occurred. Please try again.");
            }
            console.error("Firebase error:", err.code, err.message);
          }
        };
      
        const toggleMode = () => {
          setIsSigningIn(!isSigningIn); // Toggle between Sign Up and Sign In
          setError(null); // Clear errors when switching modes
        };
      
        return (
          <div className="flex items-center justify-center min-h-screen">
            <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
              <h1 className="text-2xl text-black font-bold mb-4">
                {isSigningIn ? "Sign In" : "Register"}
              </h1>
              <form onSubmit={handleSubmit} className="space-y-4 max-w-sm mx-auto p-4">
                {/* Email Input */}
                <div>
                  <label className="block text-gray-700">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={handleEmailChange}
                    className="w-full p-2 border rounded-lg text-black"
                    placeholder="Enter your email"
                    required
                  />
                </div>
      
                {/* Password Input */}
                <div>
                  <label className="block text-gray-700">Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={handlePasswordChange}
                    className="w-full p-2 border border-gray-300 rounded"
                    placeholder="Enter your password"
                    required
                  />
                </div>
      
                {/* Error Message */}
                {error && <p className="text-red-500 text-sm">{error}</p>}
      
                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full bg-blue-500 text-white font-bold py-2 rounded hover:bg-blue-600 transition duration-200"
                >
                  {isSigningIn ? "Sign In" : "Register"}
                </button>
              </form>
      
              {/* Toggle Between Sign In and Sign Up */}
              <div className="mt-4 text-center">
                <p className="text-gray-600">
                  {isSigningIn
                    ? "Don't have an account?"
                    : "Already have an account?"}{" "}
                  <button
                    type="button"
                    onClick={toggleMode}
                    className="text-blue-500 underline"
                  >
                    {isSigningIn ? "Register" : "Sign In"}
                  </button>
                </p>
              </div>
            </div>
          </div>
        );
      }