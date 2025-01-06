import Header from "@/components/Header";
import JobsPortal from "@/components/JobsPortal";
import RentalsPortal from "@/components/RentalsPortal";
import ExchangeRatePortal from "@/components/ExchangeRatePortal";
import ShippingCalculator from "@/components/ShippingCalculator";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-site-blue/5 via-white to-site-blue/5">
      <Header />
      <main className="w-full px-6 py-12 md:px-8 lg:px-12">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 auto-rows-fr">
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