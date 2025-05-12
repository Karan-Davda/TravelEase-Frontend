
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CheckCircle, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BookingSuccessDialogProps {
  isOpen: boolean;
  onClose: () => void;
  bookingData: {
    fromCity: string;
    toCity: string;
    transportationType: string;
    transportationName: string;
    selectedSeats?: { SeatNumber: string }[];
    email: string;
    firstName: string;
  };
}

const BookingSuccessDialog = ({ isOpen, onClose, bookingData }: BookingSuccessDialogProps) => {
  const { fromCity, toCity, transportationType, transportationName, selectedSeats, email, firstName } = bookingData;
  
  const handleDownloadItinerary = () => {
    // This would be implemented to generate and download a PDF
    console.log("Downloading itinerary...");
    // For now we'll just show an alert
    alert("Itinerary download functionality would be implemented here");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center">
            <CheckCircle className="h-6 w-6 text-green-500 mr-2" />
            Booking Confirmed!
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 mt-4">
          {/* Booking Details */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Flight Details</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Route:</span>
                <span className="font-medium">{fromCity} to {toCity}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Transportation:</span>
                <span className="font-medium">{transportationType} - {transportationName}</span>
              </div>
              {selectedSeats && selectedSeats.length > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Seats:</span>
                  <span className="font-medium">{selectedSeats.map(seat => seat.SeatNumber).join(", ")}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-600">Confirmation Sent To:</span>
                <span className="font-medium">{email}</span>
              </div>
            </div>
          </div>
          
          {/* Next Steps */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">Next Steps</h3>
            
            <div className="flex gap-2">
              <div className="bg-gray-100 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-sm font-semibold">1</span>
              </div>
              <div>
                <p className="font-medium">Check Your Email</p>
                <p className="text-gray-600 text-sm">
                  We've sent a detailed confirmation with all your booking information.
                </p>
              </div>
            </div>
            
            <div className="flex gap-2">
              <div className="bg-gray-100 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-sm font-semibold">2</span>
              </div>
              <div>
                <p className="font-medium">Download Your Itinerary</p>
                <p className="text-gray-600 text-sm">
                  Get a copy of your full itinerary with all the important details.
                </p>
                <Button 
                  variant="ghost" 
                  className="mt-1 text-primary p-0 h-auto hover:bg-transparent hover:text-primary/80"
                  onClick={handleDownloadItinerary}
                >
                  <Download size={16} className="mr-1" />
                  Download PDF Itinerary
                </Button>
              </div>
            </div>
          </div>
          
          {/* Close Button */}
          <div className="flex justify-center pt-2">
            <Button onClick={onClose}>Continue</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BookingSuccessDialog;
