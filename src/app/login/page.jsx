// "use client";

// import { useAuth } from "@/context/AuthContext";

// export default function LoginPage() {
//   const { user, loginWithGoogle, logout } = useAuth();

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-100">
//       <div className="bg-white p-8 rounded shadow-md w-full max-w-sm text-center">
//         <h1 className="text-xl font-bold mb-4">  🛍️ WelcomeShopping</h1>

//         {!user ? (
//           <button
//             onClick={loginWithGoogle}
//             className="bg-[#2874f0] text-white px-6 py-2 rounded hover:bg-blue-600 transition"
//           >
//             Login with Google
//           </button>
//         ) : (
//           <div className="space-y-4">
//             <p className="text-sm text-gray-700">
//               Logged in as <strong>{user.displayName}</strong>
//             </p>
//             <button
//               onClick={logout}
//               className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
//             >
//               Logout
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }



"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const { user, loginWithGoogle, logout } = useAuth();
  const router = useRouter();

  const handleLogin = async () => {
    try {
      await loginWithGoogle();       // login function from context
      router.push("/");              // ✅ redirect to homepage
    } catch (err) {
      console.error("Login failed:", err);
      alert("Login failed. Please try again.");
    }
  };

  useEffect(() => {
    // If already logged in, redirect
    if (user) {
      router.push("/");
    }
  }, [user]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-sm text-center">
        <h1 className="text-xl font-bold mb-4">🛍️ WelcomeShopping</h1>

        {!user ? (
          <button
            onClick={handleLogin}
            className="bg-[#2874f0] text-white px-6 py-2 rounded hover:bg-blue-600 transition"
          >
            Login with Google
          </button>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-gray-700">
              Logged in as <strong>{user.displayName}</strong>
            </p>
            <button
              onClick={logout}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}