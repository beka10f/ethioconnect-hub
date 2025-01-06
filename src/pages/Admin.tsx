import Header from "@/components/Header";
import JobsManagement from "@/components/admin/JobsManagement";
import RentalsManagement from "@/components/admin/RentalsManagement";
import ExchangeRateManagement from "@/components/admin/ExchangeRateManagement";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DollarSign, Briefcase, Home } from "lucide-react";

const Admin = () => {
  const { isAuthChecked } = useAdminAuth();

  if (!isAuthChecked) {
    return (
      <div className="min-h-screen bg-ethiopian-cream">
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
    <div className="min-h-screen bg-ethiopian-cream/50">
      <Header />
      <main className="container mx-auto py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <Card className="border-none shadow-none bg-transparent mb-8">
            <CardHeader className="px-0">
              <CardTitle className="text-3xl font-bold text-ethiopian-coffee">
                Admin Dashboard
              </CardTitle>
            </CardHeader>
          </Card>

          <Tabs defaultValue="exchange" className="space-y-8">
            <TabsList className="w-full sm:w-auto inline-flex h-11 items-center justify-center rounded-lg bg-ethiopian-coffee/5 p-1 text-ethiopian-coffee">
              <TabsTrigger 
                value="exchange" 
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-6 py-3 text-sm font-medium ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ethiopian-coffee focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-white data-[state=active]:text-ethiopian-coffee data-[state=active]:shadow-sm hover:bg-white/80"
              >
                <DollarSign className="mr-2 h-4 w-4" />
                Exchange Rate
              </TabsTrigger>
              <TabsTrigger 
                value="jobs"
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-6 py-3 text-sm font-medium ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ethiopian-coffee focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-white data-[state=active]:text-ethiopian-coffee data-[state=active]:shadow-sm hover:bg-white/80"
              >
                <Briefcase className="mr-2 h-4 w-4" />
                Jobs
              </TabsTrigger>
              <TabsTrigger 
                value="rentals"
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-6 py-3 text-sm font-medium ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ethiopian-coffee focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-white data-[state=active]:text-ethiopian-coffee data-[state=active]:shadow-sm hover:bg-white/80"
              >
                <Home className="mr-2 h-4 w-4" />
                Rentals
              </TabsTrigger>
            </TabsList>

            <TabsContent value="exchange">
              <Card className="bg-white shadow-md border-ethiopian-sage/10">
                <CardHeader>
                  <CardTitle className="text-2xl font-semibold text-ethiopian-coffee">
                    Exchange Rate Management
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="max-w-md mx-auto">
                    <ExchangeRateManagement />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="jobs">
              <Card className="bg-white shadow-md border-ethiopian-sage/10">
                <CardContent className="p-6">
                  <JobsManagement />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="rentals">
              <Card className="bg-white shadow-md border-ethiopian-sage/10">
                <CardContent className="p-6">
                  <RentalsManagement />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Admin;