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
    <div className="min-h-screen bg-ethiopian-cream">
      <Header />
      <main className="container mx-auto py-8 px-4">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="flex items-center">
            <h1 className="text-3xl font-bold text-ethiopian-coffee">Admin Dashboard</h1>
          </div>
          
          <Card className="bg-white shadow-sm border-none">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold text-ethiopian-coffee mb-4">Exchange Rate Management</h2>
              <Separator className="mb-4" />
              <ExchangeRateManagement />
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm border-none">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold text-ethiopian-coffee mb-4">Jobs Management</h2>
              <Separator className="mb-4" />
              <JobsManagement />
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm border-none">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold text-ethiopian-coffee mb-4">Rentals Management</h2>
              <Separator className="mb-4" />
              <RentalsManagement />
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Admin;