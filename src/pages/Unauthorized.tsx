
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShieldOff } from "lucide-react";
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import useSeo from '@/hooks/useSeo';

const Unauthorized = () => {
  const navigate = useNavigate();
  
  // Set page SEO
  useSeo({
    title: "Access Denied - TravelEase",
    description: "You don't have permission to access this page."
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-grow flex items-center justify-center">
        <div className="max-w-md w-full p-8 text-center">
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6">
            <ShieldOff className="h-8 w-8 text-red-500" />
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-3">Access Denied</h1>
          
          <p className="text-gray-600 mb-8">
            You don't have permission to access this page. Please contact your administrator if you believe this is an error.
          </p>
          
          <div className="space-x-4">
            <Button
              onClick={() => navigate('/')}
              variant="default"
            >
              Return to Home
            </Button>
            
            <Button
              onClick={() => navigate(-1)}
              variant="outline"
            >
              Go Back
            </Button>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Unauthorized;
