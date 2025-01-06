import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import PendingJobsTable from "@/components/admin/PendingJobsTable";
import PendingRentalsTable from "@/components/admin/PendingRentalsTable";

const Admin = () => {
  const navigate = useNavigate();
  const [pendingJobs, setPendingJobs] = useState([]);
  const [pendingRentals, setPendingRentals] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    checkAdminStatus();
    fetchPendingListings();
    setupRealtimeSubscriptions();
  }, []);

  const checkAdminStatus = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate("/login");
      return;
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profile?.role !== "admin") {
      navigate("/");
      return;
    }

    setIsAdmin(true);
  };

  const fetchPendingListings = async () => {
    // Fetch pending jobs
    const { data: jobs } = await supabase
      .from("jobs")
      .select("*")
      .eq("status", "pending")
      .order("created_at", { ascending: false });

    // Fetch pending rentals
    const { data: rentals } = await supabase
      .from("rentals")
      .select("*")
      .eq("status", "pending")
      .order("created_at", { ascending: false });

    if (jobs) setPendingJobs(jobs);
    if (rentals) setPendingRentals(rentals);
  };

  const setupRealtimeSubscriptions = () => {
    // Subscribe to jobs changes
    const jobsChannel = supabase
      .channel('public:jobs')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'jobs' }, 
        () => {
          console.log("Jobs table changed, fetching updates");
          fetchPendingListings();
        }
      )
      .subscribe();

    // Subscribe to rentals changes
    const rentalsChannel = supabase
      .channel('public:rentals')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'rentals' }, 
        () => {
          console.log("Rentals table changed, fetching updates");
          fetchPendingListings();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(jobsChannel);
      supabase.removeChannel(rentalsChannel);
    };
  };

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-blue-50">
      <Header />
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>
        
        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Pending Jobs</h2>
            <PendingJobsTable 
              pendingJobs={pendingJobs} 
              onJobUpdate={fetchPendingListings} 
            />
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Pending Rentals</h2>
            <PendingRentalsTable 
              pendingRentals={pendingRentals} 
              onRentalUpdate={fetchPendingListings} 
            />
          </section>
        </div>
      </div>
    </div>
  );
};

export default Admin;