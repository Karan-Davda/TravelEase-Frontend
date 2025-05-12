
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { 
  User, LogOut, Calendar, Bell, CreditCard, Clock, 
  Settings, Check, X, MapPin
} from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

// Mock data for upcoming trips
const upcomingTrips = [
  {
    id: 'TR123456',
    name: 'European Capitals Explorer',
    destination: 'London, Paris, Rome',
    startDate: 'June 15, 2025',
    endDate: 'June 26, 2025',
    image: 'https://images.unsplash.com/photo-1561637258-29ca98102396',
    status: 'confirmed'
  }
];

// Mock data for saved trips
const savedTrips = [
  {
    id: 'SV789012',
    name: 'Thailand Beach & Culture Getaway',
    destination: 'Bangkok, Phuket',
    image: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a',
    duration: '8 days',
    price: 1299
  }
];

const Account = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('upcoming');
  const [notificationSettings, setNotificationSettings] = useState({
    email: true,
    sms: false,
    whatsapp: true
  });

  const handleSignOut = () => {
    // Sign out logic would be here
    toast({
      title: "Signed out successfully",
      description: "You have been signed out of your account.",
    });
    
    // Redirect to home page
    navigate('/');
  };

  const handleNotificationToggle = (type: keyof typeof notificationSettings) => {
    setNotificationSettings(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
    
    toast({
      title: "Notification settings updated",
      description: `${type.charAt(0).toUpperCase() + type.slice(1)} notifications are now ${!notificationSettings[type] ? 'enabled' : 'disabled'}.`,
    });
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="pt-24 pb-16 bg-gray-50">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Sidebar */}
            <div className="md:w-64 shrink-0">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <User size={24} className="text-primary" />
                  </div>
                  <div>
                    <h2 className="font-semibold">John Doe</h2>
                    <p className="text-sm text-gray-600">john.doe@example.com</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <button
                    className={`w-full text-left px-4 py-2 rounded-md flex items-center space-x-2 ${
                      activeTab === 'upcoming' ? 'bg-primary text-white' : 'hover:bg-gray-100'
                    }`}
                    onClick={() => setActiveTab('upcoming')}
                  >
                    <Calendar size={18} />
                    <span>Upcoming Trips</span>
                  </button>
                  
                  <button
                    className={`w-full text-left px-4 py-2 rounded-md flex items-center space-x-2 ${
                      activeTab === 'saved' ? 'bg-primary text-white' : 'hover:bg-gray-100'
                    }`}
                    onClick={() => setActiveTab('saved')}
                  >
                    <Clock size={18} />
                    <span>Saved Trips</span>
                  </button>
                  
                  <button
                    className={`w-full text-left px-4 py-2 rounded-md flex items-center space-x-2 ${
                      activeTab === 'payments' ? 'bg-primary text-white' : 'hover:bg-gray-100'
                    }`}
                    onClick={() => setActiveTab('payments')}
                  >
                    <CreditCard size={18} />
                    <span>Payment Methods</span>
                  </button>
                  
                  <button
                    className={`w-full text-left px-4 py-2 rounded-md flex items-center space-x-2 ${
                      activeTab === 'notifications' ? 'bg-primary text-white' : 'hover:bg-gray-100'
                    }`}
                    onClick={() => setActiveTab('notifications')}
                  >
                    <Bell size={18} />
                    <span>Notifications</span>
                  </button>
                  
                  <button
                    className={`w-full text-left px-4 py-2 rounded-md flex items-center space-x-2 ${
                      activeTab === 'settings' ? 'bg-primary text-white' : 'hover:bg-gray-100'
                    }`}
                    onClick={() => setActiveTab('settings')}
                  >
                    <Settings size={18} />
                    <span>Account Settings</span>
                  </button>
                  
                  <hr className="my-4 border-gray-200" />
                  
                  <button
                    className="w-full text-left px-4 py-2 rounded-md flex items-center space-x-2 text-red-600 hover:bg-red-50"
                    onClick={handleSignOut}
                  >
                    <LogOut size={18} />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            </div>
            
            {/* Main Content */}
            <div className="flex-1">
              {/* Upcoming Trips */}
              {activeTab === 'upcoming' && (
                <div>
                  <h1 className="text-2xl font-display font-bold mb-6">
                    Upcoming Trips
                  </h1>
                  
                  {upcomingTrips.length > 0 ? (
                    <div className="space-y-6">
                      {upcomingTrips.map(trip => (
                        <div 
                          key={trip.id} 
                          className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex flex-col md:flex-row gap-6"
                        >
                          <div className="w-full md:w-1/3 h-48">
                            <img 
                              src={trip.image} 
                              alt={trip.name}
                              className="w-full h-full object-cover rounded-md"
                            />
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between items-start mb-2">
                              <h2 className="text-xl font-semibold">{trip.name}</h2>
                              <div className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
                                Confirmed
                              </div>
                            </div>
                            <div className="flex items-center text-gray-600 mb-4">
                              <MapPin size={16} className="mr-1" />
                              {trip.destination}
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                              <div>
                                <p className="text-sm text-gray-500">Departure</p>
                                <p className="font-medium">{trip.startDate}</p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-500">Return</p>
                                <p className="font-medium">{trip.endDate}</p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-500">Booking Reference</p>
                                <p className="font-medium">{trip.id}</p>
                              </div>
                            </div>
                            <div className="flex flex-wrap gap-3">
                              <button className="btn-primary text-sm py-2">
                                View Itinerary
                              </button>
                              <button className="btn-outline text-sm py-2">
                                Modify Trip
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 text-center">
                      <div className="mb-4">
                        <Calendar size={40} className="text-gray-400 mx-auto" />
                      </div>
                      <h3 className="text-lg font-semibold mb-2">No Upcoming Trips</h3>
                      <p className="text-gray-600 mb-6">
                        You don't have any trips scheduled yet. Start planning your next adventure!
                      </p>
                      <button className="btn-primary">
                        Plan a New Trip
                      </button>
                    </div>
                  )}
                </div>
              )}
              
              {/* Saved Trips */}
              {activeTab === 'saved' && (
                <div>
                  <h1 className="text-2xl font-display font-bold mb-6">
                    Saved Trips
                  </h1>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {savedTrips.map(trip => (
                      <div 
                        key={trip.id} 
                        className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
                      >
                        <div className="h-48 w-full">
                          <img 
                            src={trip.image} 
                            alt={trip.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="p-6">
                          <h2 className="text-lg font-semibold mb-2">{trip.name}</h2>
                          <div className="flex items-center text-gray-600 mb-4">
                            <MapPin size={16} className="mr-1" />
                            {trip.destination}
                          </div>
                          <div className="flex justify-between text-gray-600 mb-4">
                            <span>{trip.duration}</span>
                            <span className="font-semibold">${trip.price}</span>
                          </div>
                          <div className="flex space-x-3">
                            <button className="btn-primary text-sm py-2 flex-1">
                              Book Now
                            </button>
                            <button className="btn-outline text-sm py-2 flex-1">
                              Edit
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {/* Add New Trip Card */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 border-dashed flex items-center justify-center h-72">
                      <div className="text-center p-6">
                        <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                          <span className="text-3xl text-gray-500">+</span>
                        </div>
                        <h3 className="text-lg font-medium mb-2">Save a New Trip</h3>
                        <p className="text-gray-600 mb-4">
                          Create and save a trip for future booking
                        </p>
                        <button className="btn-outline">
                          Start Planning
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Notification Settings */}
              {activeTab === 'notifications' && (
                <div>
                  <h1 className="text-2xl font-display font-bold mb-6">
                    Notification Preferences
                  </h1>
                  
                  <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <p className="text-gray-600 mb-6">
                      Choose how you'd like to receive updates about your trips and special offers.
                    </p>
                    
                    <div className="space-y-6">
                      {/* Email notifications */}
                      <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                        <div>
                          <h3 className="font-medium mb-1">Email Notifications</h3>
                          <p className="text-sm text-gray-600">Receive booking confirmations, updates, and offers via email</p>
                        </div>
                        <button
                          className={`w-12 h-6 rounded-full p-1 transition-colors ${
                            notificationSettings.email ? 'bg-green-500' : 'bg-gray-300'
                          }`}
                          onClick={() => handleNotificationToggle('email')}
                        >
                          <div className={`bg-white w-4 h-4 rounded-full transform transition-transform ${
                            notificationSettings.email ? 'translate-x-6' : 'translate-x-0'
                          }`}></div>
                        </button>
                      </div>
                      
                      {/* SMS notifications */}
                      <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                        <div>
                          <h3 className="font-medium mb-1">SMS Notifications</h3>
                          <p className="text-sm text-gray-600">Get text messages for important travel updates</p>
                        </div>
                        <button
                          className={`w-12 h-6 rounded-full p-1 transition-colors ${
                            notificationSettings.sms ? 'bg-green-500' : 'bg-gray-300'
                          }`}
                          onClick={() => handleNotificationToggle('sms')}
                        >
                          <div className={`bg-white w-4 h-4 rounded-full transform transition-transform ${
                            notificationSettings.sms ? 'translate-x-6' : 'translate-x-0'
                          }`}></div>
                        </button>
                      </div>
                      
                      {/* WhatsApp notifications */}
                      <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                        <div>
                          <h3 className="font-medium mb-1">WhatsApp Notifications</h3>
                          <p className="text-sm text-gray-600">Receive real-time updates via WhatsApp</p>
                        </div>
                        <button
                          className={`w-12 h-6 rounded-full p-1 transition-colors ${
                            notificationSettings.whatsapp ? 'bg-green-500' : 'bg-gray-300'
                          }`}
                          onClick={() => handleNotificationToggle('whatsapp')}
                        >
                          <div className={`bg-white w-4 h-4 rounded-full transform transition-transform ${
                            notificationSettings.whatsapp ? 'translate-x-6' : 'translate-x-0'
                          }`}></div>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Payments */}
              {activeTab === 'payments' && (
                <div>
                  <h1 className="text-2xl font-display font-bold mb-6">
                    Payment Methods
                  </h1>
                  
                  <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-lg font-semibold">Saved Payment Methods</h2>
                      <button className="btn-outline text-sm py-2">
                        Add New Card
                      </button>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex justify-between items-center p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-center">
                          <div className="bg-blue-100 p-2 rounded-md mr-4">
                            <svg className="w-6 h-6 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
                              <line x1="1" y1="10" x2="23" y2="10"></line>
                            </svg>
                          </div>
                          <div>
                            <p className="font-medium">Visa ending in 4242</p>
                            <p className="text-sm text-gray-500">Expires 05/25</p>
                          </div>
                        </div>
                        <div className="flex">
                          <button className="text-gray-500 hover:text-gray-700 mr-2">Edit</button>
                          <button className="text-red-500 hover:text-red-700">Remove</button>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-center">
                          <div className="bg-red-100 p-2 rounded-md mr-4">
                            <svg className="w-6 h-6 text-red-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
                              <line x1="1" y1="10" x2="23" y2="10"></line>
                            </svg>
                          </div>
                          <div>
                            <p className="font-medium">Mastercard ending in 5555</p>
                            <p className="text-sm text-gray-500">Expires 08/26</p>
                          </div>
                        </div>
                        <div className="flex">
                          <button className="text-gray-500 hover:text-gray-700 mr-2">Edit</button>
                          <button className="text-red-500 hover:text-red-700">Remove</button>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <h2 className="text-lg font-semibold mb-6">Payment History</h2>
                    <table className="w-full">
                      <thead className="text-left text-sm text-gray-500 border-b border-gray-200">
                        <tr>
                          <th className="pb-3">Date</th>
                          <th className="pb-3">Description</th>
                          <th className="pb-3">Amount</th>
                          <th className="pb-3">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-gray-100">
                          <td className="py-4">May 12, 2025</td>
                          <td>European Capitals Explorer</td>
                          <td>$2,038.98</td>
                          <td className="flex items-center">
                            <span className="inline-flex items-center bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                              <Check size={12} className="mr-1" />
                              Paid
                            </span>
                          </td>
                        </tr>
                        <tr>
                          <td className="py-4">Apr 3, 2025</td>
                          <td>Trip Reservation Deposit</td>
                          <td>$250.00</td>
                          <td>
                            <span className="inline-flex items-center bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                              <Check size={12} className="mr-1" />
                              Paid
                            </span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
              
              {/* Account Settings */}
              {activeTab === 'settings' && (
                <div>
                  <h1 className="text-2xl font-display font-bold mb-6">
                    Account Settings
                  </h1>
                  
                  <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
                    <h2 className="text-lg font-semibold mb-4">Personal Information</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          First Name
                        </label>
                        <input
                          type="text"
                          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                          defaultValue="John"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Last Name
                        </label>
                        <input
                          type="text"
                          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                          defaultValue="Doe"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Email
                        </label>
                        <input
                          type="email"
                          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                          defaultValue="john.doe@example.com"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                          defaultValue="+1 (555) 123-4567"
                        />
                      </div>
                    </div>
                    
                    <button className="btn-primary mt-6">
                      Save Changes
                    </button>
                  </div>
                  
                  <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <h2 className="text-lg font-semibold mb-4">Password & Security</h2>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Current Password
                        </label>
                        <input
                          type="password"
                          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          New Password
                        </label>
                        <input
                          type="password"
                          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Confirm New Password
                        </label>
                        <input
                          type="password"
                          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                        />
                      </div>
                    </div>
                    
                    <button className="btn-primary mt-6">
                      Update Password
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Account;
