/* 
Dashboard page
*/

'use client';
import { useUser } from "@clerk/nextjs";  // Import useUser hook for user info

export default function Dashboard() {
  const { user, isLoaded } = useUser();  // Access the user data

  if (!isLoaded) {
    return <div>Loading...</div>;  // Wait until the user data is loaded
  }

  // Add a check for user being null or undefined
  if (!user) {
    return <div className="text-red-500 text-9xl pl-3.5 font-bold">No user found. Please log in again.</div>;
  }

  // render the dashboard
  return (
    // users name will be displayed
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-semibold text-blue-600">Dashboard</h1>
        <p className="mt-4 text-lg text-gray-700">
          Welcome, {user.firstName} {user.lastName}!
        </p>
      </div>
    </div>
  );
}
