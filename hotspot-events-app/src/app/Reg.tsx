import React from "react";

// props interface
interface RegistrationProps {
  onRegister: () => void; // pass to component as prop
}

const Registration: React.FC<RegistrationProps> = ({ onRegister }) => {
  return (
        <div className="flex items-center justify-center min-h-screen">
                <form
                className="space-y-4 max-w-sm mx-auto p-4"
                onSubmit={(e) => { 
                        e.preventDefault();
                        onRegister(); 
                }}>
                <h2 className="text-2xl font-black text-white text-center">Register</h2>
                <input type="email" placeholder="Email" className="w-full p-2 border rounded-lg text-black" required />
                <input type="password" placeholder="Password" className="w-full p-2 border rounded-lg text-black" required />
                <button className="w-full bg-green-600 hover:bg-violet-600 focus:outline-none rounded-full py-2 text-white text-sizefont-extrabold transition delay-25">
                        <h1>Sign Up</h1>
                </button>
                </form>
        </div>
        );
};

export default Registration;