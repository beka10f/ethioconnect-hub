import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import PendingJobsTable from "@/components/admin/PendingJobsTable";
import PendingRentalsTable from "@/components/admin/PendingRentalsTable";

type JobListing = {
  id: string;
  title: string;
  company_name: string;
  location: string;
  status: string;
  created_at: string;
};

type RentalListing = {
  id: string;
  title: string;
  address: string;
  price: number;
  status: string;
  created_at: string;
};

const Admin = () => {
  const navigate = useNavigate();
  const [pendingJobs, setPendingJobs] = useState<JobListing[]>([]);
  const [pendingRentals, setPendingRentals] = useState<RentalListing[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    checkAdminStatus();
    fetchPendingListings();
    setupRealtimeSubscriptions();
  }, []);

  const setupRealtimeSubscriptions = () => {
    const jobsChannel = supabase
      .channel('public:jobs')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'jobs' }, 
        () => {
          fetchPendingListings();
        }
      )
      .subscribe();

    const rentalsChannel = supabase
      .channel('public:rentals')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'rentals' }, 
        () => {
          fetchPendingListings();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(jobsChannel);
      supabase.removeChannel(rentalsChannel);
    };
  };

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
    const { data: jobs } = await supabase
      .from("jobs")
      .select("*")
      .eq("status", "pending")
      .order("created_at", { ascending: false });

    const { data: rentals } = await supabase
      .from("rentals")
      .select("*")
      .eq("status", "pending")
      .order("created_at", { ascending: false });

    if (jobs) setPendingJobs(jobs);
    if (rentals) setPendingRentals(rentals);
  };

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-ethiopian-cream">
      <Header />
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold text-ethiopian-coffee mb-8">Admin Dashboard</h1>
        
        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-semibold text-ethiopian-coffee mb-4">Pending Jobs</h2>
            <PendingJobsTable 
              pendingJobs={pendingJobs} 
              onJobUpdate={fetchPendingListings} 
            />
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-ethiopian-coffee mb-4">Pending Rentals</h2>
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