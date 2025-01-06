import Header from "@/components/Header";
import JobsPortal from "@/components/JobsPortal";
import RentalsPortal from "@/components/RentalsPortal";
import ExchangeRatePortal from "@/components/ExchangeRatePortal";
import ShippingCalculator from "@/components/ShippingCalculator";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-site-blue/5 via-white to-site-blue/5">
      <Header />
      <main className="w-full px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-8 sm:space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 auto-rows-fr">
            <JobsPortal />
            <RentalsPortal />
            <ExchangeRatePortal />
          </div>
          <div className="mt-8">
            <ShippingCalculator />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;