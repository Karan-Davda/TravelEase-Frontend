
import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { PackagesBrowser } from '@/components/travel-agency/PackagesBrowser';
import { PopularDestinations } from '@/components/travel-agency/PopularDestinations';
import { DashboardStats } from '@/components/travel-agency/DashboardStats';
import { useToast } from '@/components/ui/use-toast';
import useSeo from '@/hooks/useSeo';
import { fetchWithAuth } from '@/utils/apiHelper';
import { Package } from '@/types/packageTypes';

interface AgencySummary {
  TotalPackages: number;
  ActivePackages: number;
  DraftPackages: number;
  TotalRegistered: number;
  TourGuidesAffiliated: number;
}

const TravelAgencyDashboard = () => {
  const [isSummaryLoading, setIsSummaryLoading] = useState(true);
  const [isPackagesLoading, setIsPackagesLoading] = useState(true);
  const [summary, setSummary] = useState<AgencySummary | null>(null);
  const [packages, setPackages] = useState<Package[]>([]);
  const { toast } = useToast();
  
  // Set page SEO
  useSeo({
    title: "Dashboard - TravelEase Agency Portal",
    description: "Manage your travel packages, bookings, and tour guides on the TravelEase agency dashboard."
  });

  useEffect(() => {
    const fetchSummaryData = async () => {
      try {
        setIsSummaryLoading(true);
        const data = await fetchWithAuth<AgencySummary>("http://localhost:3000/api/partners/summary");
        setSummary(data);
      } catch (error) {
        console.error("Failed to fetch agency summary:", error);
        toast({
          title: "Error",
          description: "Failed to load dashboard data. Please try again later.",
          variant: "destructive"
        });
      } finally {
        setIsSummaryLoading(false);
      }
    };

    const fetchPackagesData = async () => {
      try {
        setIsPackagesLoading(true);
        const data = await fetchWithAuth<Package[]>("http://localhost:3000/api/partners/packages");
        setPackages(data);
      } catch (error) {
        console.error("Failed to fetch packages:", error);
        toast({
          title: "Error",
          description: "Failed to load packages data. Please try again later.",
          variant: "destructive"
        });
      } finally {
        setIsPackagesLoading(false);
      }
    };

    fetchSummaryData();
    fetchPackagesData();
  }, [toast]);
  
  // Transform the summary data to the format expected by DashboardStats
  const dashboardStats = summary ? [
    { name: 'Total Packages', value: summary.TotalPackages },
    { name: 'Active Packages', value: summary.ActivePackages },
    { name: 'Packages in Draft', value: summary.DraftPackages },
    { name: 'Total Users', value: summary.TotalRegistered },
    { name: 'Tour Guides Affiliated', value: summary.TourGuidesAffiliated }
  ] : [];

  // Sample data for destinations (would also come from API in a real app)
  const popularDestinations = [
    {
      name: "Chicago",
      image: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&q=80",
      packageCount: 14,
      link: "/destination/chicago"
    },
    {
      name: "Los Angeles",
      image: "https://images.unsplash.com/photo-1534190760961-74e8c1c5c3da?auto=format&fit=crop&q=80",
      packageCount: 20,
      link: "/destination/los-angeles"
    },
    {
      name: "Boston",
      image: "https://images.unsplash.com/photo-1501979376754-f817c5eb4966?auto=format&fit=crop&q=80",
      packageCount: 8,
      link: "/destination/boston"
    },
    {
      name: "Seattle",
      image: "https://images.unsplash.com/photo-1438401171849-74ac270044ee?auto=format&fit=crop&q=80",
      packageCount: 11,
      link: "/destination/seattle"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Banner Image */}
      <div className="w-full h-48 bg-cover bg-center mt-20" 
           style={{ backgroundImage: `url(https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&q=80)` }}>
        <div className="container-custom h-full flex items-center">
          <div className="bg-black/40 p-6 rounded-lg backdrop-blur-sm">
            <h1 className="text-3xl font-bold text-white">Agency Dashboard</h1>
            <p className="text-white/90">Manage your travel packages and business</p>
          </div>
        </div>
      </div>
      
      {/* Stats Section */}
      <section className="py-10 bg-gray-50">
        <div className="container-custom">
          <DashboardStats stats={dashboardStats} isLoading={isSummaryLoading} />
        </div>
      </section>
      
      {/* My Packages */}
      <section className="py-12 bg-white">
        <div className="container-custom">
          <PackagesBrowser packages={packages} isLoading={isPackagesLoading} />
        </div>
      </section>
      
      {/* Popular Destinations */}
      <section className="py-12 bg-gray-50">
        <div className="container-custom">
          <PopularDestinations destinations={popularDestinations} />
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default TravelAgencyDashboard;
