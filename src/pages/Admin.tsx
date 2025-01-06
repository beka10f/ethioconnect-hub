import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import JobsManagementTable from "@/components/admin/JobsManagementTable";
import PendingRentalsTable from "@/components/admin/PendingRentalsTable";

type JobStatus = 'pending' | 'approved' | 'rejected';

const Admin = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<any[]>([]);
  const [pendingRentals, setPendingRentals] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<JobStatus>('pending');

  useEffect(() => {
    checkAdminStatus();
    fetchListings();
    setupRealtimeSubscriptions();
  }, [selectedStatus]);

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

  const fetchListings = async () => {
    // Fetch jobs based on selected status
    const { data: jobsData } = await supabase
      .from("jobs")
      .select("*")
      .eq("status", selectedStatus)
      .order("created_at", { ascending: false });

    // Fetch pending rentals
    const { data: rentals } = await supabase
      .from("rentals")
      .select("*")
      .eq("status", "pending")
      .order("created_at", { ascending: false });

    if (jobsData) setJobs(jobsData);
    if (rentals) setPendingRentals(rentals);
  };

  const setupRealtimeSubscriptions = () => {
    const jobsChannel = supabase
      .channel('public:jobs')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'jobs' }, 
        () => {
          console.log("Jobs table changed, fetching updates");
          fetchListings();
        }
      )
      .subscribe();

    const rentalsChannel = supabase
      .channel('public:rentals')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'rentals' }, 
        () => {
          console.log("Rentals table changed, fetching updates");
          fetchListings();
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
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Jobs Management</h2>
            <Tabs defaultValue="pending" className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger 
                  value="pending" 
                  onClick={() => setSelectedStatus('pending')}
                >
                  Pending Approval
                </TabsTrigger>
                <TabsTrigger 
                  value="approved" 
                  onClick={() => setSelectedStatus('approved')}
                >
                  Approved
                </TabsTrigger>
                <TabsTrigger 
                  value="rejected" 
                  onClick={() => setSelectedStatus('rejected')}
                >
                  Rejected
                </TabsTrigger>
              </TabsList>

              <TabsContent value="pending" className="mt-0">
                <JobsManagementTable 
                  jobs={jobs} 
                  onJobUpdate={fetchListings}
                  status="pending"
                />
              </TabsContent>
              <TabsContent value="approved" className="mt-0">
                <JobsManagementTable 
                  jobs={jobs} 
                  onJobUpdate={fetchListings}
                  status="approved"
                />
              </TabsContent>
              <TabsContent value="rejected" className="mt-0">
                <JobsManagementTable 
                  jobs={jobs} 
                  onJobUpdate={fetchListings}
                  status="rejected"
                />
              </TabsContent>
            </Tabs>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Pending Rentals</h2>
            <PendingRentalsTable 
              pendingRentals={pendingRentals} 
              onRentalUpdate={fetchListings} 
            />
          </section>
        </div>
      </div>
    </div>
  );
};

export default Admin;