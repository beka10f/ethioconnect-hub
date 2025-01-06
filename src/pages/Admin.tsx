import Header from "@/components/Header";
import JobsManagement from "@/components/admin/JobsManagement";
import RentalsManagement from "@/components/admin/RentalsManagement";
import ExchangeRateManagement from "@/components/admin/ExchangeRateManagement";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
    <div className="min-h-screen bg-ethiopian-cream">
      <Header />
      <main className="container mx-auto py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center mb-8">
            <h1 className="text-3xl font-bold text-ethiopian-coffee">Admin Dashboard</h1>
          </div>

          <Tabs defaultValue="exchange" className="space-y-8">
            <TabsList className="w-full border-b border-ethiopian-sage/20 bg-transparent">
              <TabsTrigger 
                value="exchange" 
                className="data-[state=active]:border-b-2 data-[state=active]:border-ethiopian-coffee data-[state=active]:text-ethiopian-coffee px-6 py-3"
              >
                Exchange Rate
              </TabsTrigger>
              <TabsTrigger 
                value="jobs" 
                className="data-[state=active]:border-b-2 data-[state=active]:border-ethiopian-coffee data-[state=active]:text-ethiopian-coffee px-6 py-3"
              >
                Jobs
              </TabsTrigger>
              <TabsTrigger 
                value="rentals" 
                className="data-[state=active]:border-b-2 data-[state=active]:border-ethiopian-coffee data-[state=active]:text-ethiopian-coffee px-6 py-3"
              >
                Rentals
              </TabsTrigger>
            </TabsList>

            <TabsContent value="exchange" className="space-y-4">
              <Card className="bg-white shadow-sm border-ethiopian-sage/20">
                <CardContent className="p-6">
                  <div className="max-w-md mx-auto">
                    <ExchangeRateManagement />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="jobs">
              <Card className="bg-white shadow-sm border-ethiopian-sage/20">
                <CardContent className="p-6">
                  <JobsManagement />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="rentals">
              <Card className="bg-white shadow-sm border-ethiopian-sage/20">
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