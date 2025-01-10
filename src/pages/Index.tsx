import Header from "@/components/Header";
import JobsPortal from "@/components/JobsPortal";
import RentalsPortal from "@/components/RentalsPortal";
import ExchangeRatePortal from "@/components/ExchangeRatePortal";
import ShippingCalculator from "@/components/ShippingCalculator";
import { motion } from "framer-motion";
import { Building, Home, DollarSign } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Index = () => {
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <Header />
      
      <main className="w-full px-4 py-6 sm:px-8 sm:py-10 lg:px-10">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Introduction Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center px-4 py-8 sm:py-12 bg-white rounded-2xl shadow-sm border border-gray-100"
          >
            <h1 className="text-3xl sm:text-4xl font-semibold text-gray-900 tracking-tight mb-4">
              Ethiopian DMV Hub
            </h1>
            <p className="mt-4 text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
              Your one-stop platform for Ethiopian community services in the DMV area.
            </p>
          </motion.div>

          {/* Shipping Calculator - Always at top */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full rounded-2xl overflow-hidden shadow-sm bg-white border border-gray-100"
          >
            <ShippingCalculator />
          </motion.div>

          {/* Portals Grid */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {isMobile ? (
              <>
                <div className="grid grid-cols-2 gap-4 col-span-full">
                  {/* Mobile Job Button */}
                  <Link to="/jobs" className="block aspect-square">
                    <Button 
                      className="w-full h-full bg-white hover:bg-gray-50 text-gray-900 border border-gray-200 shadow-sm p-4 flex flex-col items-center justify-center gap-4 group transition-all duration-300 rounded-2xl"
                      variant="ghost"
                    >
                      <div className="rounded-2xl bg-blue-50 p-4 transition-transform duration-300 group-hover:scale-105">
                        <Building className="w-8 h-8 text-site-blue" />
                      </div>
                      <div className="space-y-1">
                        <span className="text-base font-medium block">Jobs</span>
                        <span className="text-xs text-gray-500 block">Browse Listings</span>
                      </div>
                    </Button>
                  </Link>

                  {/* Mobile Rental Button */}
                  <Link to="/rentals" className="block aspect-square">
                    <Button 
                      className="w-full h-full bg-white hover:bg-gray-50 text-gray-900 border border-gray-200 shadow-sm p-4 flex flex-col items-center justify-center gap-4 group transition-all duration-300 rounded-2xl"
                      variant="ghost"
                    >
                      <div className="rounded-2xl bg-blue-50 p-4 transition-transform duration-300 group-hover:scale-105">
                        <Home className="w-8 h-8 text-site-blue" />
                      </div>
                      <div className="space-y-1">
                        <span className="text-base font-medium block">Rentals</span>
                        <span className="text-xs text-gray-500 block">Find Housing</span>
                      </div>
                    </Button>
                  </Link>
                </div>

                {/* Exchange Rate Portal - Rectangle on mobile */}
                <div className="col-span-full">
                  <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="rounded-xl bg-blue-50 p-3">
                        <DollarSign className="w-6 h-6 text-site-blue" />
                      </div>
                      <span className="text-lg font-medium text-gray-900">Exchange Rate</span>
                    </div>
                    <ExchangeRatePortal />
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="w-full">
                  <JobsPortal />
                </div>
                <div className="w-full">
                  <RentalsPortal />
                </div>
                <div className="w-full">
                  <ExchangeRatePortal />
                </div>
              </>
            )}
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default Index;