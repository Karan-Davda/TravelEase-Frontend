
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Users, Compass, User } from "lucide-react";

const RoleSelectionForm = () => {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedRole === 'user') {
      navigate('/signup/user');
    } else if (selectedRole === 'agency') {
      navigate('/signup/agency');
    } else if (selectedRole === 'guide') {
      navigate('/signup/guide');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <p className="text-center text-gray-600 mb-4">
          Select how you want to use TravelEase
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card 
            className={`p-4 flex flex-col items-center cursor-pointer transition-all ${
              selectedRole === 'user' 
                ? 'border-2 border-primary bg-primary/5' 
                : 'border hover:border-primary'
            }`}
            onClick={() => setSelectedRole('user')}
          >
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
              <User className="h-6 w-6 text-primary" />
            </div>
            <span className="text-sm font-medium text-center">Traveler</span>
            <p className="text-xs text-gray-500 text-center mt-1">Find and book trips</p>
          </Card>
          
          <Card 
            className={`p-4 flex flex-col items-center cursor-pointer transition-all ${
              selectedRole === 'agency' 
                ? 'border-2 border-primary bg-primary/5' 
                : 'border hover:border-primary'
            }`}
            onClick={() => setSelectedRole('agency')}
          >
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <span className="text-sm font-medium text-center">Travel Agency</span>
            <p className="text-xs text-gray-500 text-center mt-1">List your packages</p>
          </Card>
          
          <Card 
            className={`p-4 flex flex-col items-center cursor-pointer transition-all ${
              selectedRole === 'guide' 
                ? 'border-2 border-primary bg-primary/5' 
                : 'border hover:border-primary'
            }`}
            onClick={() => setSelectedRole('guide')}
          >
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
              <Compass className="h-6 w-6 text-primary" />
            </div>
            <span className="text-sm font-medium text-center">Tour Guide</span>
            <p className="text-xs text-gray-500 text-center mt-1">Offer guide services</p>
          </Card>
        </div>
      </div>
      
      <Button
        type="submit"
        className="w-full"
        disabled={!selectedRole}
      >
        Continue
      </Button>
      
      <p className="mt-4 text-center text-sm text-gray-600">
        Already have an account?{" "}
        <a href="/login" className="text-primary font-medium hover:underline">
          Login
        </a>
      </p>
    </form>
  );
};

export default RoleSelectionForm;
