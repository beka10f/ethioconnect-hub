import Header from "@/components/Header";
import ExchangeRatePortal from "@/components/ExchangeRatePortal";
import JobsPortal from "@/components/JobsPortal";
import RentalsPortal from "@/components/RentalsPortal";
import BusinessDirectoryPortal from "@/components/BusinessDirectoryPortal";
import CalendarPortal from "@/components/CalendarPortal";
import MoneyTransferPortal from "@/components/MoneyTransferPortal";
import ShippingCalculator from "@/components/ShippingCalculator";

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50/50 backdrop-blur-sm">
      <Header />
      <main className="container mx-auto py-8 px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <ExchangeRatePortal />
          <MoneyTransferPortal />
          <JobsPortal />
          <RentalsPortal />
          <BusinessDirectoryPortal />
          <CalendarPortal />
          <ShippingCalculator />
        </div>
      </main>
    </div>
  );
};

export default Index;