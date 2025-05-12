
import { useNavigate } from "react-router-dom";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { LockOpen } from "lucide-react";

interface LoginRequiredDialogProps {
  isOpen: boolean;
}

const LoginRequiredDialog = ({ isOpen }: LoginRequiredDialogProps) => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/login");
  };

  return (
    <Dialog open={isOpen}>
      <DialogContent className="sm:max-w-[425px]" onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle className="text-2xl">Authentication Required</DialogTitle>
          <DialogDescription>
            You need to be logged in to proceed with your booking.
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col items-center mt-6 space-y-4">
          <div className="p-3 bg-primary/10 rounded-full">
            <LockOpen className="h-8 w-8 text-primary" />
          </div>
          
          <p className="text-center text-muted-foreground">
            Please log in to your TravelEase account to continue with your booking process. This ensures your booking details are saved to your account.
          </p>
          
          <Button 
            onClick={handleLogin} 
            className="w-full bg-primary hover:bg-primary/90"
          >
            Log In Now
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LoginRequiredDialog;
