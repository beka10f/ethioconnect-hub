import Header from "@/components/Header";
import JobsManagement from "@/components/admin/JobsManagement";
import RentalsManagement from "@/components/admin/RentalsManagement";
import ExchangeRateManagement from "@/components/admin/ExchangeRateManagement";
import ShippingManagement from "@/components/admin/ShippingManagement";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DollarSign, Briefcase, Home, Package } from "lucide-react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

const Admin = () => {
  const { isAuthChecked } = useAdminAuth();

  if (!isAuthChecked) {
    return (
      <div className="min-h-screen bg-gray-50">
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
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto space-y-8">
            <div className="space-y-2">
              <h1 className="text-4xl font-bold text-gray-900">
                Admin Dashboard
              </h1>
              <p className="text-lg text-gray-600">
                Manage your platform's content and settings
              </p>
            </div>

            <Tabs defaultValue="exchange" className="space-y-8">
              <div className="sticky top-0 z-30 -mx-4 px-4 py-4 bg-gray-50/80 backdrop-blur-sm">
                <TabsList className="w-full sm:w-auto inline-flex h-12 items-center justify-center rounded-lg bg-white p-1 text-site-blue shadow-sm border">
                  <TabsTrigger 
                    value="exchange" 
                    className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-6 py-3.5 text-sm font-medium ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-site-blue focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-site-blue data-[state=active]:text-white data-[state=active]:shadow-sm hover:bg-site-blue/10"
                  >
                    <DollarSign className="mr-2 h-4 w-4" />
                    Exchange Rate
                  </TabsTrigger>
                  <TabsTrigger 
                    value="jobs"
                    className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-6 py-3.5 text-sm font-medium ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-site-blue focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-site-blue data-[state=active]:text-white data-[state=active]:shadow-sm hover:bg-site-blue/10"
                  >
                    <Briefcase className="mr-2 h-4 w-4" />
                    Jobs
                  </TabsTrigger>
                  <TabsTrigger 
                    value="rentals"
                    className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-6 py-3.5 text-sm font-medium ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-site-blue focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-site-blue data-[state=active]:text-white data-[state=active]:shadow-sm hover:bg-site-blue/10"
                  >
                    <Home className="mr-2 h-4 w-4" />
                    Rentals
                  </TabsTrigger>
                  <TabsTrigger 
                    value="shipping"
                    className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-6 py-3.5 text-sm font-medium ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-site-blue focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-site-blue data-[state=active]:text-white data-[state=active]:shadow-sm hover:bg-site-blue/10"
                  >
                    <Package className="mr-2 h-4 w-4" />
                    Shipping
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="exchange" className="mt-6 space-y-6">
                <Card className="bg-white shadow-sm border-gray-200/50">
                  <CardContent className="p-6">
                    <ExchangeRateManagement />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="jobs" className="mt-6 space-y-6">
                <Card className="bg-white shadow-sm border-gray-200/50">
                  <CardContent className="p-6">
                    <JobsManagement />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="rentals" className="mt-6 space-y-6">
                <Card className="bg-white shadow-sm border-gray-200/50">
                  <CardContent className="p-6">
                    <RentalsManagement />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="shipping" className="mt-6 space-y-6">
                <Card className="bg-white shadow-sm border-gray-200/50">
                  <CardContent className="p-6">
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