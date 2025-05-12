
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  Calendar,
  MapPin,
  User,
  Users,
  ArrowLeft,
  CheckCircle,
  Plane,
  Bus,
  Train,
  Car,
  Hotel,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Seat } from "@/services/seatService";
import { parseISO, format } from "date-fns";
import { Button } from "@/components/ui/button";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { fetchApi } from "@/utils/apiHelper";
import { clearAuthData, getAuthToken, isAuthenticated } from '@/utils/authUtils';
import LoginRequiredDialog from "@/components/dialogs/LoginRequiredDialog";
import BookingSuccessDialog from "@/components/dialogs/BookingSuccessDialog";

// Initialize Stripe
const stripePromise = loadStripe(
  "pk_test_51RMttXIRsww9Vexta8kppKbtz4WQ7M5SzAu0CH23xeso3BJha81oVwZ1U60M50HDMIjgvk1c9do06UlJfKsw6jDM00V5AW40I2"
);

interface TransportationBookingState {
  transportationId: number;
  transportationType: "flight" | "bus" | "train";
  transportationName: string;
  selectedSeats: Seat[];
  isTransportationBooking: boolean;
  fromCityName?: string;
  toCityName?: string;
  departureTime?: string;
  arrivalTime?: string;
  transportationPrice: number;
  totalPrice: number;
}

interface CustomTripBookingState {
  destination: string;
  dates: string;
  departureDate?: string;
  returnDate?: string;
  travelers: number;
  days: number;
  selectedOptions: {
    flight?: any;
    hotel?: any;
    transport?: any;
  };
  totalPrice: number;
}

interface UserProfile {
  userId: number;
  FirstName: string;
  LastName: string;
  email: string;
  role: number;
}

// Payment form component with Stripe integration
const PaymentForm = ({
  amount,
  bookingId,
  transportationId,
  selectedSeats,
  userProfile,
  onPaymentSuccess,
}: {
  amount: number;
  bookingId: string;
  transportationId?: number;
  selectedSeats?: Seat[];
  userProfile: UserProfile | null;
  onPaymentSuccess: () => void;
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not loaded yet
      return;
    }

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      setPaymentError("Card element not found");
      return;
    }

    setIsProcessing(true);
    setPaymentError(null);

    try {
      // Get the user ID from the profile if available
      const userId = userProfile?.userId?.toString() || "guest_user";
      console.log(userId);

      // Prepare metadata for the payment intent
      const metadata: Record<string, string> = {
        userId,
      };

      // Add transportation-specific metadata if this is a transportation booking
      if (transportationId) {
        metadata.transportationId = transportationId.toString();
      }

      if (selectedSeats && selectedSeats.length > 0) {
        metadata.seats = selectedSeats.map((s) => s.SeatNumber).join(",");
      }

      console.log("Creating payment intent with metadata:", metadata);

      // Create the payment intent
      const intentResponse = await fetch(
        "http://localhost:3000/api/payments/create-intent",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            amount: Math.round(amount),
            currency: "usd",
            metadata,
          }),
        }
      );

      const intentData = await intentResponse.json();

      if (!intentResponse.ok) {
        throw new Error(intentData.error || "Failed to create payment intent");
      }

      if (!intentData.clientSecret) {
        throw new Error("No client secret received from payment service");
      }

      console.log("Payment intent created:", intentData);

      // Confirm the card payment
      const { error, paymentIntent } = await stripe.confirmCardPayment(
        intentData.clientSecret,
        {
          payment_method: {
            card: cardElement,
            billing_details: {
              name: userProfile
                ? `${userProfile.FirstName} ${userProfile.LastName}`
                : "Guest User",
            },
          },
        }
      );

      if (error) {
        throw new Error(error.message || "Payment failed");
      } else if (paymentIntent && paymentIntent.status === "succeeded") {
        console.log("Payment succeeded:", paymentIntent);
        setPaymentSuccess(true);
        // Show success toast
        toast({ title: "Payment successful", description: "Your booking has been confirmed." });
        
        // Instead of navigating, call the onPaymentSuccess callback
        setTimeout(() => onPaymentSuccess(), 1000);
      }
    } catch (error) {
      console.error("Payment error:", error);
      setPaymentError(
        error instanceof Error ? error.message : "Payment processing failed"
      );
      toast({
        title: "Payment error",
        description:
          error instanceof Error
            ? error.message
            : "There was an error processing your payment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Card Information
        </label>
        <div className="p-3 border border-gray-300 rounded-md">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: "16px",
                  color: "#32325d",
                  fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
                  "::placeholder": {
                    color: "#aab7c4",
                  },
                },
                invalid: {
                  color: "#fa755a",
                  iconColor: "#fa755a",
                },
              },
            }}
          />
        </div>
      </div>

      {paymentError && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm">
          {paymentError}
        </div>
      )}

      {paymentSuccess && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md text-green-600 text-sm">
          Payment successful!
        </div>
      )}

      <button
        type="submit"
        disabled={!stripe || isProcessing || paymentSuccess}
        className="w-full bg-[#f1365e] hover:bg-[#d01c45] text-white font-medium py-3 text-base rounded-md disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {isProcessing ? "Processing..." : `Pay $${amount.toFixed(2)}`}
      </button>

      <div className="mt-4 flex justify-center">
        <div className="flex items-center space-x-2">
          <img src="/images/visa.svg" alt="Visa" className="h-6" />
          <img src="/images/mastercard.svg" alt="Mastercard" className="h-6" />
          <img src="/images/amex.svg" alt="American Express" className="h-6" />
        </div>
      </div>
      <p className="text-xs text-gray-500 text-center mt-2">
        Secure payment processing by Stripe
      </p>
    </form>
  );
};

// Main BookingCheckout component
const BookingCheckout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [booking, setBooking] = useState({
    id: "BK123456",
    packageName: "European Capitals Explorer",
    destination: "London, Paris, Rome",
    startDate: "June 15, 2025",
    endDate: "June 26, 2025",
    adults: 2,
    children: 0,
    days: 10,
    price: {
      basePrice: 1899,
      taxes: 149.99,
      serviceFee: 89.99,
      total: 2038.98,
      discount: 0,
    },
    included: [
      "Return flights from New York",
      "All accommodations (4-star hotels)",
      "Breakfast daily",
      "Major sights guided tours",
      "Airport transfers",
      "24/7 customer support",
    ],
  });
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [isPromoValid, setIsPromoValid] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);

  // Transportation booking state
  const [transportBooking, setTransportBooking] =
    useState<TransportationBookingState | null>(null);
  const [customTripBooking, setCustomTripBooking] =
    useState<CustomTripBookingState | null>(null);

  useEffect(() => {
    // Check if user is logged in
    const checkAuthStatus = async () => {
      const authenticated = isAuthenticated();
      setIsLoggedIn(authenticated);
      
      if (authenticated) {
        // Fetch user profile - consolidated to a single function call
        try {
          const token = getAuthToken();
          const response = await fetch("http://localhost:3000/api/auth/profile", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (response.ok) {
            const data = await response.json();
            setUserProfile(data);
          } else {
            // If token is invalid, clear auth data
            clearAuthData();
            setIsLoggedIn(false);
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
          setIsLoggedIn(false);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    checkAuthStatus();

    // Check if we have transportation booking data from state
    if (location.state && location.state.isTransportationBooking) {
      const transportData = location.state as TransportationBookingState;
      setTransportBooking(transportData);

      // Calculate price based on selected seats
      const selectedSeats = transportData.selectedSeats || [];
      const totalSeatsPrice =
        selectedSeats.length > 0 ? transportData.totalPrice : 0;
      const pricePerSeat =
        selectedSeats.length > 0 ? transportData.transportationPrice : 0;

      // Calculate taxes and fees
      const basePrice = totalSeatsPrice;
      const taxes = basePrice * 0.08; // 8% tax
      const serviceFee = basePrice * 0.05; // 5% service fee

      // Format the departure and arrival times
      const formattedDepartureTime = transportData.departureTime
        ? format(new Date(transportData.departureTime), "MMMM d, yyyy h:mm a")
        : "May 11, 2025";

      const formattedArrivalTime = transportData.arrivalTime
        ? format(new Date(transportData.arrivalTime), "MMMM d, yyyy h:mm a")
        : "";

      // Update booking with transportation info
      setBooking({
        id: `TR${Math.floor(100000 + Math.random() * 900000)}`, // Generate a random booking ID
        packageName: transportData.transportationName,
        destination:
          transportData.fromCityName && transportData.toCityName
            ? `${transportData.fromCityName} to ${transportData.toCityName}`
            : "New York",
        startDate: formattedDepartureTime,
        endDate: formattedArrivalTime,
        adults: selectedSeats.length,
        children: 0,
        days: 1,
        price: {
          basePrice,
          taxes,
          serviceFee,
          total: basePrice + taxes + serviceFee,
          discount: 0,
        },
        included: [
          `${selectedSeats.length} ${
            selectedSeats.length === 1 ? "seat" : "seats"
          } on ${transportData.transportationName}`,
          `Seat ${selectedSeats.map((s) => s.SeatNumber).join(", ")}`,
          transportData.fromCityName && transportData.toCityName
            ? `Travel from ${transportData.fromCityName} to ${transportData.toCityName}`
            : "",
          `Price per seat: $${pricePerSeat.toFixed(2)}`,
          "E-ticket delivery",
          "24/7 customer support",
        ].filter((item) => item !== ""), // Remove empty items
      });
    }
    // Check if we have custom trip booking data
    else if (
      location.state &&
      location.state.destination &&
      location.state.selectedOptions
    ) {
      const tripData = location.state as CustomTripBookingState;
      setCustomTripBooking(tripData);

      // Extract data
      const {
        destination,
        dates,
        travelers,
        days,
        selectedOptions,
        totalPrice,
      } = tripData;

      // Calculate taxes and fees
      const basePrice = totalPrice;
      const taxes = basePrice * 0.08; // 8% tax
      const serviceFee = basePrice * 0.05; // 5% service fee
      const finalTotal = basePrice + taxes + serviceFee;

      // Build included items
      const included = [];

      // Add appropriate items based on selected options
      if (selectedOptions.flight) {
        included.push(
          `${selectedOptions.flight.name}`,
          `${travelers} ${travelers === 1 ? "passenger" : "passengers"}`
        );
      } else if (selectedOptions.transport) {
        const transportType = selectedOptions.transport.type;
        included.push(
          `${selectedOptions.transport.name}`,
          `${
            transportType === "car"
              ? `${days} ${days === 1 ? "day" : "days"} car rental`
              : `${travelers} ${travelers === 1 ? "passenger" : "passengers"}`
          }`
        );
      }

      if (selectedOptions.hotel) {
        included.push(
          `${days} ${days === 1 ? "night" : "nights"} at ${
            selectedOptions.hotel.name
          }`,
          `${selectedOptions.hotel.details?.amenities || "Standard amenities"}`
        );
      }

      included.push(
        "24/7 customer support",
        "Free cancellation up to 48 hours before departure"
      );

      // Update booking with custom trip info
      setBooking({
        id: `CT${Math.floor(100000 + Math.random() * 900000)}`, // Generate a random booking ID
        packageName: `Trip to ${destination}`,
        destination: destination,
        startDate: tripData.departureDate
          ? format(parseISO(tripData.departureDate), "MMMM d, yyyy")
          : "Flexible",
        endDate: tripData.returnDate
          ? format(parseISO(tripData.returnDate), "MMMM d, yyyy")
          : "",
        adults: travelers,
        children: 0,
        days,
        price: {
          basePrice: totalPrice,
          taxes,
          serviceFee,
          total: finalTotal,
          discount: 0,
        },
        included,
      });
    }
  }, [location.state]);

  // Handle successful payment
  const handlePaymentSuccess = () => {
    // Mock sending email in a real application you'd call an API for this
    console.log(`
      Sending email to: ${userProfile?.email}
      
      Subject: Your TravelEase Booking Confirmation
      
      Body:
      Hi ${userProfile?.FirstName},
      
      Your ${transportBooking?.transportationType} - ${transportBooking?.transportationName} 
      from ${transportBooking?.fromCityName} to ${transportBooking?.toCityName} has been Booked.
      
      Thank You,
      TravelEase Team
    `);
    
    // Show the success dialog
    setShowSuccessDialog(true);
  };

  const handleCloseSuccessDialog = () => {
    setShowSuccessDialog(false);
    // Return to home page after closing the dialog
    navigate('/');
  };

  const handlePromoSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Simple promo validation
    if (promoCode.toUpperCase() === "TRAVEL10") {
      setIsPromoValid(true);
      // Apply 10% discount
      setBooking((prev) => {
        const discount = prev.price.basePrice * 0.1;
        const newTotal = prev.price.total - discount;

        return {
          ...prev,
          price: {
            ...prev.price,
            discount,
            total: newTotal,
          },
        };
      });

      toast({
        title: "Promo code applied!",
        description: "You received 10% off your booking.",
      });

      setPromoApplied(true);
    } else {
      setIsPromoValid(false);
      toast({
        title: "Invalid promo code",
        description: "Please check and try again.",
        variant: "destructive",
      });
    }
  };

  // Get transportation icon based on type
  const getTransportIcon = () => {
    if (!transportBooking) return null;

    switch (transportBooking.transportationType) {
      case "flight":
        return <Plane size={18} className="mr-2 text-primary" />;
      case "bus":
        return <Bus size={18} className="mr-2 text-primary" />;
      case "train":
        return <Train size={18} className="mr-2 text-primary" />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Login Required Dialog */}
      <LoginRequiredDialog isOpen={!isLoggedIn && !loading} />
      
      {/* Booking Success Dialog */}
      {transportBooking && userProfile && (
        <BookingSuccessDialog 
          isOpen={showSuccessDialog}
          onClose={handleCloseSuccessDialog}
          bookingData={{
            fromCity: transportBooking.fromCityName || "",
            toCity: transportBooking.toCityName || "",
            transportationType: transportBooking.transportationType,
            transportationName: transportBooking.transportationName,
            selectedSeats: transportBooking.selectedSeats,
            email: userProfile.email,
            firstName: userProfile.FirstName
          }}
        />
      )}
      
      {isLoggedIn && (
        <main className="pt-24 pb-16 bg-gray-50">
          <div className="container-custom">
            <div className="flex items-center mb-8">
              <button
                onClick={() => navigate(-1)}
                className="flex items-center text-gray-600 hover:text-primary transition-colors"
              >
                <ArrowLeft size={18} className="mr-1" />
                Back
              </button>
              <h1 className="text-2xl md:text-3xl font-display font-bold ml-4">
                Complete Your Booking
              </h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6">
                {/* Booking Details */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                  <h2 className="text-lg font-semibold mb-4">
                    {transportBooking
                      ? "Transportation Summary"
                      : customTripBooking
                        ? "Custom Trip Summary"
                        : "Trip Summary"}
                  </h2>
                  <div className="space-y-4">
                    <div className="flex flex-wrap gap-6">
                      {transportBooking && (
                        <div className="flex items-start">
                          {getTransportIcon()}
                          <div>
                            <p className="text-sm text-gray-500">
                              Transportation
                            </p>
                            <p className="font-medium">
                              {transportBooking.transportationName}
                            </p>
                          </div>
                        </div>
                      )}

                      {customTripBooking &&
                        customTripBooking.selectedOptions.flight && (
                          <div className="flex items-start">
                            <Plane size={18} className="mr-2 text-primary mt-1" />
                            <div>
                              <p className="text-sm text-gray-500">Flight</p>
                              <p className="font-medium">
                                {customTripBooking.selectedOptions.flight.name}
                              </p>
                            </div>
                          </div>
                        )}

                      {customTripBooking &&
                        customTripBooking.selectedOptions.transport && (
                          <div className="flex items-start">
                            {customTripBooking.selectedOptions.transport.type ===
                              "train" ? (
                              <Train
                                size={18}
                                className="mr-2 text-primary mt-1"
                              />
                            ) : customTripBooking.selectedOptions.transport
                              .type === "bus" ? (
                              <Bus size={18} className="mr-2 text-primary mt-1" />
                            ) : (
                              <Car size={18} className="mr-2 text-primary mt-1" />
                            )}
                            <div>
                              <p className="text-sm text-gray-500">
                                {customTripBooking.selectedOptions.transport
                                  .type === "train"
                                  ? "Train"
                                  : customTripBooking.selectedOptions.transport
                                    .type === "bus"
                                    ? "Bus"
                                    : "Car Rental"}
                              </p>
                              <p className="font-medium">
                                {customTripBooking.selectedOptions.transport.name}
                              </p>
                            </div>
                          </div>
                        )}

                      {customTripBooking &&
                        customTripBooking.selectedOptions.hotel && (
                          <div className="flex items-start">
                            <Hotel size={18} className="mr-2 text-primary mt-1" />
                            <div>
                              <p className="text-sm text-gray-500">Hotel</p>
                              <p className="font-medium">
                                {customTripBooking.selectedOptions.hotel.name}
                              </p>
                            </div>
                          </div>
                        )}

                      <div className="flex items-start">
                        <MapPin size={18} className="mr-2 text-primary mt-1" />
                        <div>
                          <p className="text-sm text-gray-500">Destination</p>
                          <p className="font-medium">{booking.destination}</p>
                        </div>
                      </div>

                      <div className="flex items-start">
                        <Calendar size={18} className="mr-2 text-primary mt-1" />
                        <div>
                          <p className="text-sm text-gray-500">Date</p>
                          <p className="font-medium">
                            {booking.startDate}
                            {booking.endDate && ` - ${booking.endDate}`}
                          </p>
                        </div>
                      </div>

                      {!transportBooking && (
                        <div className="flex items-start">
                          <Users size={18} className="mr-2 text-primary mt-1" />
                          <div>
                            <p className="text-sm text-gray-500">Travelers</p>
                            <p className="font-medium">
                              {booking.adults}{" "}
                              {booking.adults === 1 ? "Adult" : "Adults"}
                              {booking.children > 0 &&
                                `, ${booking.children} ${booking.children === 1 ? "Child" : "Children"
                                }`}
                            </p>
                          </div>
                        </div>
                      )}

                      {transportBooking && (
                        <div className="flex items-start">
                          <Users size={18} className="mr-2 text-primary mt-1" />
                          <div>
                            <p className="text-sm text-gray-500">Seats</p>
                            <p className="font-medium">
                              {transportBooking.selectedSeats.length}{" "}
                              {transportBooking.selectedSeats.length === 1
                                ? "Seat"
                                : "Seats"}{" "}
                              (
                              {transportBooking.selectedSeats
                                .map((s) => s.SeatNumber)
                                .join(", ")}
                              )
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="pt-4 border-t border-gray-100">
                      <h3 className="font-medium mb-2">What's Included:</h3>
                      <ul className="space-y-1">
                        {booking.included.map((item, index) => (
                          <li key={index} className="flex items-start">
                            <CheckCircle
                              size={16}
                              className="mr-2 text-green-500 mt-0.5"
                            />
                            <span className="text-gray-700">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Traveler Information */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                  <h2 className="text-lg font-semibold mb-4">
                    Traveler Information
                  </h2>

                  {/* Primary Traveler */}
                  <div className="mb-6">
                    <h3 className="flex items-center text-md font-medium mb-4">
                      <User size={18} className="mr-2" />
                      Primary Traveler (Contact Person)
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="firstName"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          First Name
                        </label>
                        <input
                          id="firstName"
                          type="text"
                          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                          required
                          defaultValue={userProfile?.FirstName || ""}
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="lastName"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Last Name
                        </label>
                        <input
                          id="lastName"
                          type="text"
                          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                          required
                          defaultValue={userProfile?.LastName || ""}
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="email"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Email
                        </label>
                        <input
                          id="email"
                          type="email"
                          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                          required
                          defaultValue={userProfile?.email || ""}
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="phone"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Phone Number
                        </label>
                        <input
                          id="phone"
                          type="tel"
                          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Additional Travelers for normal bookings */}
                  {!transportBooking && booking.adults > 1 && (
                    <div className="pt-4 border-t border-gray-100">
                      <h3 className="flex items-center text-md font-medium mb-4">
                        <User size={18} className="mr-2" />
                        Traveler 2
                      </h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label
                            htmlFor="firstName2"
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            First Name
                          </label>
                          <input
                            id="firstName2"
                            type="text"
                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                            required
                          />
                        </div>

                        <div>
                          <label
                            htmlFor="lastName2"
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            Last Name
                          </label>
                          <input
                            id="lastName2"
                            type="text"
                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                            required
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Additional seats info for transportation bookings */}
                  {transportBooking &&
                    transportBooking.selectedSeats.length > 1 && (
                      <div className="pt-4 border-t border-gray-100">
                        <h3 className="flex items-center text-md font-medium mb-4">
                          <User size={18} className="mr-2" />
                          Additional Passengers
                        </h3>

                        {[
                          ...Array(transportBooking.selectedSeats.length - 1),
                        ].map((_, i) => (
                          <div
                            key={i}
                            className="mb-6 pt-4 border-t border-gray-100"
                          >
                            <h4 className="text-sm font-medium mb-3">
                              Passenger {i + 2}
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label
                                  htmlFor={`firstName${i + 2}`}
                                  className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                  First Name
                                </label>
                                <input
                                  id={`firstName${i + 2}`}
                                  type="text"
                                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                                  required
                                />
                              </div>

                              <div>
                                <label
                                  htmlFor={`lastName${i + 2}`}
                                  className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                  Last Name
                                </label>
                                <input
                                  id={`lastName${i + 2}`}
                                  type="text"
                                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                                  required
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                </div>

                {/* Special Requests */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                  <h2 className="text-lg font-semibold mb-4">Special Requests</h2>
                  <div>
                    <label
                      htmlFor="specialRequests"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Any special requirements or preferences?
                    </label>
                    <textarea
                      id="specialRequests"
                      rows={4}
                      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                      placeholder="E.g., dietary restrictions, accessibility needs, room preferences"
                    ></textarea>
                    <p className="text-sm text-gray-500 mt-1">
                      We'll do our best to accommodate your requests, but they
                      cannot be guaranteed.
                    </p>
                  </div>
                </div>

                {/* Terms and Conditions */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                  <div className="mb-4">
                    <label className="flex items-start">
                      <input
                        type="checkbox"
                        className="w-4 h-4 mt-1 text-primary rounded focus:ring-primary border-gray-300"
                        checked={acceptTerms}
                        onChange={() => setAcceptTerms(!acceptTerms)}
                        required
                      />
                      <span className="ml-2 text-gray-700">
                        I agree to the{" "}
                        <a href="#" className="text-primary hover:underline">
                          Terms and Conditions
                        </a>{" "}
                        and{" "}
                        <a href="#" className="text-primary hover:underline">
                          Privacy Policy
                        </a>
                        , and acknowledge the{" "}
                        <a href="#" className="text-primary hover:underline">
                          Cancellation Policy
                        </a>
                        .
                      </span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Sidebar - Payment Summary */}
              <div className="lg:col-span-1 space-y-6">
                {/* Price Breakdown */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 sticky top-24">
                  <h2 className="text-xl font-semibold mb-4">
                    {booking.packageName}
                  </h2>
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">
                        {transportBooking ? "Seat Price" : "Base Price"}
                      </span>
                      <span>${booking.price.basePrice.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Taxes</span>
                      <span>${booking.price.taxes.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Service Fee</span>
                      <span>${booking.price.serviceFee.toFixed(2)}</span>
                    </div>
                    {booking.price.discount > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Discount</span>
                        <span>-${booking.price.discount.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="pt-2 mt-2 border-t border-gray-100 flex justify-between font-bold">
                      <span>Total</span>
                      <span>${booking.price.total.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Promo Code */}
                  {!promoApplied && (
                    <div className="mb-6">
                      <form onSubmit={handlePromoSubmit} className="space-y-2">
                        <label
                          htmlFor="promoCode"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Have a promo code?
                        </label>
                        <div className="flex gap-2">
                          <input
                            id="promoCode"
                            type="text"
                            className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                            placeholder="Enter code"
                            value={promoCode}
                            onChange={(e) => setPromoCode(e.target.value)}
                          />
                          <button
                            type="submit"
                            className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-md text-sm font-medium transition-colors"
                          >
                            Apply
                          </button>
                        </div>
                      </form>
                    </div>
                  )}

                  {/* Stripe Payment Form */}
                  <Elements stripe={stripePromise}>
                    <PaymentForm
                      amount={booking.price.total}
                      bookingId={booking.id}
                      transportationId={
                        transportBooking ? transportBooking.transportationId : undefined
                      }
                      selectedSeats={
                        transportBooking ? transportBooking.selectedSeats : undefined
                      }
                      userProfile={userProfile}
                      onPaymentSuccess={handlePaymentSuccess}
                    />
                  </Elements>
                </div>
              </div>
            </div>
          </div>
        </main>
      )}
      <Footer />
    </div>
  );
};

export default BookingCheckout;
