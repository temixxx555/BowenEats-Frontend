import Layout from "@/layouts/layout"; // Import the Layout component
import LoadingButton from "@/components/LoadingButton";
import { useAuth0 } from "@auth0/auth0-react";
import { Outlet } from "react-router-dom";

const ProtectedRoutes = () => {
  const { user, isAuthenticated, isLoading } = useAuth0();
  
  // Define an array of hardcoded IDs
  const hardcodedIds: string[] = [
    "auth0|66d9befe6bb843fe8d87ed54",
    "google-oauth2|107555497492928600120",
    "auth0|66db324b119bdb96742b3a40",
    "auth0|66f57727f18989fbae70761e",
    "auth0|66f9633cde01daa7358f54f5",
  ];

  if (isLoading) {
    return <LoadingButton />; // Show loading state while user data is being fetched
  }

  // Check if the user's ID matches any of the hardcoded IDs
  const isAuthorized = isAuthenticated && user?.sub && hardcodedIds.includes(user.sub);

  if (isAuthorized) {
    return (
     
        <Outlet />
     
    );
  }

  return (
    <Layout> {/* Unauthorized view wrapped in Layout */}
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            Not Authorized
          </h1>
          <p className="text-lg text-gray-700 mb-4">
            Contact the developer to be able to create your own restaurant.
          </p>
          <a 
            href="https://x.com/Temiq/" // Replace with your actual Twitter link
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            Contact me on X
          </a>
        </div>
      </div>
    </Layout>
  );
};

export default ProtectedRoutes;
