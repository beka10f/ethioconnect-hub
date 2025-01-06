import Header from "@/components/Header";
import JobsPortal from "@/components/JobsPortal";
import RentalsPortal from "@/components/RentalsPortal";
import ExchangeRatePortal from "@/components/ExchangeRatePortal";
import ShippingCalculator from "@/components/ShippingCalculator";
import { motion } from "framer-motion";
import { Building, Home, DollarSign, Plane } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-site-blue/5 via-white to-site-blue/5">
      <Header />
      
      {/* Hero Section */}
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

      {/* Features Section */}
      <section className="py-12 bg-gradient-to-b from-white to-site-blue/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {[
              {
                icon: Building,
                title: "Job Opportunities",
                description: "Find and post job opportunities within the Ethiopian community"
              },
              {
                icon: Home,
                title: "Rental Listings",
                description: "Browse and list rental properties in the DMV area"
              },
              {
                icon: DollarSign,
                title: "Exchange Rates",
                description: "Stay updated with live ETB to USD exchange rates"
              },
              {
                icon: Plane,
                title: "Shipping Services",
                description: "Calculate shipping costs to Ethiopia"
              }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 * (index + 4) }}
                className="group relative bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300"
              >
                <div className="flex items-center justify-center w-12 h-12 bg-site-blue/10 rounded-xl mb-4 group-hover:bg-site-blue/20 transition-colors">
                  <feature.icon className="w-6 h-6 text-site-blue" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Portal Sections */}
      <main className="w-full px-3 py-4 sm:px-6 sm:py-8 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6"
          >
            <div className="w-full">
              <JobsPortal />
            </div>
            <div className="w-full">
              <RentalsPortal />
            </div>
            <div className="w-full">
              <ExchangeRatePortal />
            </div>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.4 }}
            className="w-full"
          >
            <ShippingCalculator />
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default Index;