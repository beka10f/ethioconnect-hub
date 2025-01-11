import Header from "@/components/Header";
import JobsManagement from "@/components/admin/JobsManagement";
import RentalsManagement from "@/components/admin/RentalsManagement";
import ExchangeRateManagement from "@/components/admin/ExchangeRateManagement";
import ShippingManagement from "@/components/admin/ShippingManagement";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DollarSign, Briefcase, Home, Package, FileText } from "lucide-react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import FormSubmissionsManagement from "@/components/admin/FormSubmissionsManagement";
import { useIsMobile } from "@/hooks/use-mobile";

const queryClient = new QueryClient();

const Admin = () => {
  const { isAuthChecked } = useAdminAuth();
  const isMobile = useIsMobile();

  if (!isAuthChecked) {
    return (
      <div className="min-h-screen bg-gray-50/50 backdrop-blur-sm">
        <Header />
        <div className="container mx-auto py-8 px-4">
          <div className="flex items-center justify-center min-h-[400px]">
            <p className="text-gray-500">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-gray-50/50 backdrop-blur-sm">
        <Header />
        <main className="container mx-auto py-4 sm:py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
            <div className="space-y-2">
              <h1 className="text-3xl sm:text-4xl font-semibold text-gray-900">
                Admin Dashboard
              </h1>
              <p className="text-base sm:text-lg text-gray-600">
                Manage your platform's content and settings
              </p>
            </div>

            <Tabs defaultValue="submissions" className="space-y-6 sm:space-y-8">
              <div className="sticky top-0 z-30 -mx-4 px-4 py-3 bg-gray-50/80 backdrop-blur-sm border-b border-gray-200/50">
                <TabsList className="w-full grid grid-cols-2 sm:grid-cols-5 gap-1 bg-white/70 backdrop-blur-sm p-1 rounded-xl shadow-sm border border-gray-200/50">
                  <TabsTrigger 
                    value="submissions" 
                    className="data-[state=active]:bg-site-blue data-[state=active]:text-white"
                  >
                    <FileText className="w-4 h-4 sm:mr-2" />
                    <span className="hidden sm:inline">Forms</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="exchange" 
                    className="data-[state=active]:bg-site-blue data-[state=active]:text-white"
                  >
                    <DollarSign className="w-4 h-4 sm:mr-2" />
                    <span className="hidden sm:inline">Exchange</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="jobs"
                    className="data-[state=active]:bg-site-blue data-[state=active]:text-white"
                  >
                    <Briefcase className="w-4 h-4 sm:mr-2" />
                    <span className="hidden sm:inline">Jobs</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="rentals"
                    className="data-[state=active]:bg-site-blue data-[state=active]:text-white"
                  >
                    <Home className="w-4 h-4 sm:mr-2" />
                    <span className="hidden sm:inline">Rentals</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="shipping"
                    className="data-[state=active]:bg-site-blue data-[state=active]:text-white"
                  >
                    <Package className="w-4 h-4 sm:mr-2" />
                    <span className="hidden sm:inline">Shipping</span>
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="submissions" className="mt-6 space-y-6 animate-fade-in">
                <Card className="bg-white/70 backdrop-blur-sm shadow-sm border-gray-200/50">
                  <CardContent className="p-4 sm:p-6">
                    <FormSubmissionsManagement />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="exchange" className="mt-6 space-y-6 animate-fade-in">
                <Card className="bg-white/70 backdrop-blur-sm shadow-sm border-gray-200/50">
                  <CardContent className="p-4 sm:p-6">
                    <ExchangeRateManagement />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="jobs" className="mt-6 space-y-6 animate-fade-in">
                <Card className="bg-white/70 backdrop-blur-sm shadow-sm border-gray-200/50">
                  <CardContent className="p-4 sm:p-6">
                    <JobsManagement />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="rentals" className="mt-6 space-y-6 animate-fade-in">
                <Card className="bg-white/70 backdrop-blur-sm shadow-sm border-gray-200/50">
                  <CardContent className="p-4 sm:p-6">
                    <RentalsManagement />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="shipping" className="mt-6 space-y-6 animate-fade-in">
                <Card className="bg-white/70 backdrop-blur-sm shadow-sm border-gray-200/50">
                  <CardContent className="p-4 sm:p-6">
                    <ShippingManagement />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </QueryClientProvider>
  );
};

export default Admin;