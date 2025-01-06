import Header from "@/components/Header";
import JobsManagement from "@/components/admin/JobsManagement";
import PendingRentalsTable from "@/components/admin/PendingRentalsTable";
import { useAdminAuth } from "@/hooks/useAdminAuth";

const Admin = () => {
  const { isAuthChecked } = useAdminAuth();

  if (!isAuthChecked) {
    return (
      <div className="min-h-screen bg-blue-50">
        <Header />
        <div className="container mx-auto py-8 px-4">
          <p className="text-center">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-blue-50">
      <Header />
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>
        
        <div className="space-y-8">
          <JobsManagement />

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Pending Rentals</h2>
            <PendingRentalsTable />
          </section>
        </div>
      </div>
    </div>
  );
};

export default Admin;