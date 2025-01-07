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
    <div className="min-h-screen bg-gradient-to-b from-site-blue/5 via-white to-site-blue/5">
      <Header />
      
      <main className="w-full px-3 py-4 sm:px-6 sm:py-8 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Introduction Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center px-4 py-6 sm:py-8"
          >
            <h2 className="text-2xl sm:text-3xl font-medium text-gray-900 tracking-tight">
              Welcome to Ethiopian DMV Hub
            </h2>
            <p className="mt-3 text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
              Your one-stop platform for shipping to Ethiopia, finding jobs and rentals, 
              and tracking exchange rates in the DMV area.
            </p>
          </motion.div>

          {/* Shipping Calculator - Always at top */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full"
          >
            <ShippingCalculator />
          </motion.div>

          {/* Portals Grid */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {isMobile ? (
              <>
                <div className="grid grid-cols-2 gap-4 col-span-full">
                  {/* Mobile Job Button */}
                  <Link to="/jobs" className="block aspect-square">
                    <Button 
                      className="w-full h-full bg-white hover:bg-gray-50 text-site-black border border-gray-100 shadow-sm p-4 flex flex-col items-center justify-center gap-3 group transition-all duration-300"
                      variant="ghost"
                    >
                      <div className="rounded-2xl bg-site-blue/5 p-3">
                        <Building className="w-8 h-8 text-site-blue" />
                      </div>
                      <span className="text-base font-medium">Jobs</span>
                      <span className="text-xs text-gray-500">Browse Listings</span>
                    </Button>
                  </Link>

                  {/* Mobile Rental Button */}
                  <Link to="/rentals" className="block aspect-square">
                    <Button 
                      className="w-full h-full bg-white hover:bg-gray-50 text-site-black border border-gray-100 shadow-sm p-4 flex flex-col items-center justify-center gap-3 group transition-all duration-300"
                      variant="ghost"
                    >
                      <div className="rounded-2xl bg-site-blue/5 p-3">
                        <Home className="w-8 h-8 text-site-blue" />
                      </div>
                      <span className="text-base font-medium">Rentals</span>
                      <span className="text-xs text-gray-500">Find Housing</span>
                    </Button>
                  </Link>
                </div>

                {/* Exchange Rate Portal - Rectangle on mobile */}
                <div className="col-span-full">
                  <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="rounded-xl bg-site-blue/5 p-2">
                        <DollarSign className="w-6 h-6 text-site-blue" />
                      </div>
                      <span className="text-base font-medium">Exchange Rate</span>
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

          {/* Hero Section - Below portals on mobile */}
          {isMobile ? (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-center pt-8"
            >
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                Your Ethiopian Community Hub
                <br />
                <span className="text-site-blue">in the DMV Area</span>
              </h1>
              <p className="mt-4 text-base text-gray-600">
                Connect with your community, find opportunities, and access essential services 
                all in one place.
              </p>
            </motion.div>
          ) : (
            <section className="relative overflow-hidden">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="max-w-7xl mx-auto px-4 py-16 sm:px-6 sm:py-24 lg:px-8"
              >
                <div className="text-center">
                  <motion.h1 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 tracking-tight"
                  >
                    Your Ethiopian Community Hub
                    <br />
                    <span className="text-site-blue">in the DMV Area</span>
                  </motion.h1>
                  <motion.p 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="mt-6 text-xl text-gray-600 max-w-3xl mx-auto"
                  >
                    Connect with your community, find opportunities, and access essential services 
                    all in one place. From job listings to rental properties, currency exchange 
                    rates to shipping services.
                  </motion.p>
                </div>
              </motion.div>
            </section>
          )}
        </div>
      </main>
    </div>
  );
};

export default Index;