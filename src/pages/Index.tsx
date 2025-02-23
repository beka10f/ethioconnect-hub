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

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Header />
      
      <main className="w-full max-w-6xl mx-auto py-6 sm:py-12">
        {/* Hero Section - Adjusted padding for mobile */}
        <div className="text-center mb-8 sm:mb-12 px-4 sm:px-6">
          <h1 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
            Ethiopian DMV Hub
          </h1>
          <p className="text-base sm:text-lg text-gray-600">
            Your one-stop platform for Ethiopian community services in the DMV area.
          </p>
        </div>
        
        {/* Mobile Quick Actions - Optimized touch targets */}
        {isMobile && (
          <motion.div 
            {...fadeInUp}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="grid grid-cols-2 gap-3 mb-6 px-4"
          >
            <Link to="/jobs" className="block">
              <Button 
                className="w-full h-20 sm:h-24 bg-white hover:bg-gray-50 active:bg-gray-100 text-gray-900 border border-gray-100 shadow-sm p-4 flex flex-col items-center justify-center gap-2 group transition-all duration-300 rounded-2xl"
                variant="ghost"
              >
                <Building className="w-5 h-5 sm:w-6 sm:h-6 text-site-blue transition-transform duration-300 group-hover:scale-110" />
                <span className="text-sm font-medium">Jobs</span>
              </Button>
            </Link>

            <Link to="/rentals" className="block">
              <Button 
                className="w-full h-20 sm:h-24 bg-white hover:bg-gray-50 active:bg-gray-100 text-gray-900 border border-gray-100 shadow-sm p-4 flex flex-col items-center justify-center gap-2 group transition-all duration-300 rounded-2xl"
                variant="ghost"
              >
                <Home className="w-5 h-5 sm:w-6 sm:h-6 text-site-blue transition-transform duration-300 group-hover:scale-110" />
                <span className="text-sm font-medium">Rentals</span>
              </Button>
            </Link>
          </motion.div>
        )}

        <div className="space-y-6 lg:space-y-12 px-4 sm:px-6">
          {/* Shipping Calculator - Full Width */}
          <motion.div 
            {...fadeInUp}
            className="w-full rounded-3xl overflow-hidden"
          >
            <ShippingCalculator />
          </motion.div>

          {/* Desktop Layout */}
          {!isMobile && (
            <div className="grid lg:grid-cols-2 gap-6 sm:gap-8">
              <motion.div 
                {...fadeInUp}
                transition={{ duration: 0.4, delay: 0.2 }}
                className="space-y-6"
              >
                <div className="bg-white p-4 sm:p-6 rounded-3xl border border-gray-100 shadow-sm">
                  <JobsPortal />
                </div>
              </motion.div>

              <motion.div 
                {...fadeInUp}
                transition={{ duration: 0.4, delay: 0.3 }}
                className="space-y-6"
              >
                <div className="bg-white p-4 sm:p-6 rounded-3xl border border-gray-100 shadow-sm">
                  <RentalsPortal />
                </div>
              </motion.div>
            </div>
          )}

          {/* Exchange Rate - Full Width */}
          <motion.div 
            {...fadeInUp}
            transition={{ duration: 0.4, delay: 0.4 }}
            className="bg-white p-4 sm:p-6 rounded-3xl border border-gray-100 shadow-sm"
          >
            <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
              <div className="rounded-2xl bg-blue-50 p-2 sm:p-3">
                <DollarSign className="w-5 h-5 sm:w-6 sm:h-6 text-site-blue" />
              </div>
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Exchange Rate</h2>
            </div>
            <ExchangeRatePortal />
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default Index;