import Header from "@/components/Header";
import JobsManagement from "@/components/admin/JobsManagement";
import RentalsManagement from "@/components/admin/RentalsManagement";
import ExchangeRateManagement from "@/components/admin/ExchangeRateManagement";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

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
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="flex items-center mb-8">
            <h1 className="text-3xl font-bold text-ethiopian-coffee">Admin Dashboard</h1>
          </div>

          <div className="grid gap-8">
            {/* Exchange Rate Section */}
            <Card className="bg-white shadow-sm border-ethiopian-sage/20">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold text-ethiopian-coffee">Exchange Rate Management</h2>
                  <Separator className="bg-ethiopian-sage/20" />
                  <div className="max-w-md">
                    <ExchangeRateManagement />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Jobs Management Section */}
            <Card className="bg-white shadow-sm border-ethiopian-sage/20">
              <CardContent className="p-6">
                <JobsManagement />
              </CardContent>
            </Card>

            {/* Rentals Management Section */}
            <Card className="bg-white shadow-sm border-ethiopian-sage/20">
              <CardContent className="p-6">
                <h2 className="text-2xl font-semibold text-ethiopian-coffee mb-4">Rentals Management</h2>
                <Separator className="mb-4 bg-ethiopian-sage/20" />
                <RentalsManagement />
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Admin;