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
import { ScrollArea } from "@/components/ui/scroll-area";

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
        <ScrollArea className="h-[calc(100vh-4rem)]">
          <main className="container mx-auto py-4 px-4">
            <div className="max-w-7xl mx-auto space-y-4 sm:space-y-8">
              <div className="space-y-2">
                <h1 className="text-2xl sm:text-4xl font-semibold text-gray-900">
                  Admin Dashboard
                </h1>
                <p className="text-sm sm:text-base text-gray-600">
                  Manage your platform's content and settings
                </p>
              </div>

              <Tabs defaultValue="submissions" className="space-y-4">
                <div className={`sticky ${isMobile ? 'bottom-0' : 'top-0'} z-30 -mx-4 px-4 py-3 bg-white/80 backdrop-blur-sm border-t sm:border-b border-gray-200/50`}>
                  <TabsList className="w-full grid grid-cols-5 gap-1 bg-gray-100/70 backdrop-blur-sm p-1 rounded-xl">
                    <TabsTrigger 
                      value="submissions" 
                      className="flex flex-col items-center py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm"
                    >
                      <FileText className="w-5 h-5" />
                      <span className="text-xs mt-1">Forms</span>
                    </TabsTrigger>
                    <TabsTrigger 
                      value="exchange" 
                      className="flex flex-col items-center py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm"
                    >
                      <DollarSign className="w-5 h-5" />
                      <span className="text-xs mt-1">Exchange</span>
                    </TabsTrigger>
                    <TabsTrigger 
                      value="jobs"
                      className="flex flex-col items-center py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm"
                    >
                      <Briefcase className="w-5 h-5" />
                      <span className="text-xs mt-1">Jobs</span>
                    </TabsTrigger>
                    <TabsTrigger 
                      value="rentals"
                      className="flex flex-col items-center py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm"
                    >
                      <Home className="w-5 h-5" />
                      <span className="text-xs mt-1">Rentals</span>
                    </TabsTrigger>
                    <TabsTrigger 
                      value="shipping"
                      className="flex flex-col items-center py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm"
                    >
                      <Package className="w-5 h-5" />
                      <span className="text-xs mt-1">Shipping</span>
                    </TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value="submissions" className="mt-4 space-y-4 animate-fade-in pb-24">
                  <Card className="bg-white shadow-sm border-gray-200/50">
                    <CardContent className="p-4">
                      <FormSubmissionsManagement />
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="exchange" className="mt-4 space-y-4 animate-fade-in pb-24">
                  <Card className="bg-white shadow-sm border-gray-200/50">
                    <CardContent className="p-4">
                      <ExchangeRateManagement />
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="jobs" className="mt-4 space-y-4 animate-fade-in pb-24">
                  <Card className="bg-white shadow-sm border-gray-200/50">
                    <CardContent className="p-4">
                      <JobsManagement />
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="rentals" className="mt-4 space-y-4 animate-fade-in pb-24">
                  <Card className="bg-white shadow-sm border-gray-200/50">
                    <CardContent className="p-4">
                      <RentalsManagement />
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="shipping" className="mt-4 space-y-4 animate-fade-in pb-24">
                  <Card className="bg-white shadow-sm border-gray-200/50">
                    <CardContent className="p-4">
                      <ShippingManagement />
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </main>
        </ScrollArea>
      </div>
    </QueryClientProvider>
  );
};

export default Admin;