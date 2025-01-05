import Header from "@/components/Header";
import JobsPortal from "@/components/JobsPortal";
import RentalsPortal from "@/components/RentalsPortal";
import ExchangeRatePortal from "@/components/ExchangeRatePortal";
import BusinessDirectoryPortal from "@/components/BusinessDirectoryPortal";
import CalendarPortal from "@/components/CalendarPortal";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-ethiopian-cream to-white">
      <Header />
      <main className="container mx-auto py-8 px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
          <JobsPortal />
          <RentalsPortal />
          <ExchangeRatePortal />
          <BusinessDirectoryPortal />
          <CalendarPortal />
        </div>
      </main>
    </div>
  );
};

export default Index;