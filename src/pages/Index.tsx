import Header from "@/components/Header";
import JobsPortal from "@/components/JobsPortal";
import RentalsPortal from "@/components/RentalsPortal";
import ExchangeRatePortal from "@/components/ExchangeRatePortal";
import BusinessDirectoryPortal from "@/components/BusinessDirectoryPortal";
import CalendarPortal from "@/components/CalendarPortal";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-blue-50">
      <Header />
      <main className="container mx-auto py-8 px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="aspect-[4/3]">
            <JobsPortal />
          </div>
          <div className="aspect-[4/3]">
            <RentalsPortal />
          </div>
          <div className="aspect-[4/3]">
            <ExchangeRatePortal />
          </div>
          <div className="aspect-[4/3]">
            <BusinessDirectoryPortal />
          </div>
          <div className="aspect-[4/3]">
            <CalendarPortal />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;