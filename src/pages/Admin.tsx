import { useState, useEffect } from "react";
import Header from "@/components/Header";
import JobsManagement from "@/components/admin/JobsManagement";
import PendingRentalsTable from "@/components/admin/PendingRentalsTable";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Admin = () => {
  const { isAuthChecked } = useAdminAuth();
  const [pendingRentals, setPendingRentals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPendingRentals = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("rentals")
        .select("*")
        .eq("status", "pending")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setPendingRentals(data || []);
    } catch (error) {
      console.error("Error fetching rentals:", error);
      toast.error("Failed to fetch pending rentals");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingRentals();

    // Set up real-time subscription for rentals
    const channel = supabase
      .channel('rentals-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'rentals',
          filter: `status=eq.pending`
        },
        () => {
          fetchPendingRentals();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

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
            <PendingRentalsTable 
              pendingRentals={pendingRentals} 
              onRentalUpdate={fetchPendingRentals}
            />
          </section>
        </div>
      </div>
    </div>
  );
};

export default Admin;