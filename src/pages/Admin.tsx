import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

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
      toast.error("Access denied. Admin privileges required.");
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

  const handleApproval = async (id: string, type: "job" | "rental", action: "approve" | "reject") => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const table = type === "job" ? "jobs" : "rentals";
    const { error } = await supabase
      .from(table)
      .update({
        status: action === "approve" ? "approved" : "rejected",
        approved_by: action === "approve" ? user.id : null
      })
      .eq("id", id);

    if (error) {
      toast.error(`Failed to ${action} ${type}`);
      return;
    }

    toast.success(`${type} ${action}d successfully`);
    fetchPendingListings();
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
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Company</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingJobs.map((job) => (
                    <TableRow key={job.id}>
                      <TableCell className="font-medium">{job.title}</TableCell>
                      <TableCell>{job.company_name}</TableCell>
                      <TableCell>{job.location}</TableCell>
                      <TableCell>{new Date(job.created_at).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            className="border-ethiopian-sage text-ethiopian-sage hover:bg-ethiopian-sage hover:text-white"
                            onClick={() => handleApproval(job.id, "job", "approve")}
                          >
                            Approve
                          </Button>
                          <Button
                            variant="outline"
                            className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                            onClick={() => handleApproval(job.id, "job", "reject")}
                          >
                            Reject
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-ethiopian-coffee mb-4">Pending Rentals</h2>
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Address</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingRentals.map((rental) => (
                    <TableRow key={rental.id}>
                      <TableCell className="font-medium">{rental.title}</TableCell>
                      <TableCell>{rental.address}</TableCell>
                      <TableCell>${rental.price}</TableCell>
                      <TableCell>{new Date(rental.created_at).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            className="border-ethiopian-sage text-ethiopian-sage hover:bg-ethiopian-sage hover:text-white"
                            onClick={() => handleApproval(rental.id, "rental", "approve")}
                          >
                            Approve
                          </Button>
                          <Button
                            variant="outline"
                            className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                            onClick={() => handleApproval(rental.id, "rental", "reject")}
                          >
                            Reject
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Admin;