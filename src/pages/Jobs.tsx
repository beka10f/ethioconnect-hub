import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type Job = {
  id: string;
  title: string;
  company_name: string;
  location: string;
  description: string;
  contact_info: string;
  created_at: string;
};

const Jobs = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const { data, error } = await supabase
          .from("jobs")
          .select("*")
          .eq("status", "approved")
          .order("created_at", { ascending: false });

        if (error) throw error;
        setJobs(data || []);
      } catch (error) {
        console.error("Error fetching jobs:", error);
        toast.error("Failed to load job listings");
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobs();

    // Set up real-time subscription for approved jobs
    const channel = supabase
      .channel("jobs-listing")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "jobs",
          filter: "status=eq.approved",
        },
        () => {
          fetchJobs();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div className="min-h-screen bg-ethiopian-cream">
      <Header />
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-ethiopian-coffee">Job Listings</h1>
          <Link to="/post-job">
            <Button className="bg-ethiopian-coffee text-white hover:bg-ethiopian-coffee/90">
              Post a Job
            </Button>
          </Link>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center h-32">
            <p className="text-gray-600">Loading jobs...</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {jobs.map((job) => (
              <div 
                key={job.id} 
                className="bg-white rounded-lg shadow-md p-6 border border-ethiopian-sage/20 hover:border-ethiopian-sage/40 transition-colors duration-200"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-xl font-semibold text-ethiopian-coffee">{job.title}</h2>
                    <p className="text-ethiopian-gold font-medium">{job.company_name}</p>
                    <p className="text-ethiopian-charcoal/70">{job.location}</p>
                  </div>
                  <span className="text-sm text-ethiopian-charcoal/60">
                    {new Date(job.created_at).toLocaleDateString()}
                  </span>
                </div>
                
                <p className="text-ethiopian-charcoal/80 mb-4">{job.description}</p>
                
                <div className="flex justify-between items-center">
                  <p className="text-sm text-ethiopian-charcoal/70">Contact: {job.contact_info}</p>
                  <Link to={`/jobs/${job.id}`}>
                    <Button 
                      variant="outline" 
                      className="border-ethiopian-coffee text-ethiopian-coffee hover:bg-ethiopian-coffee hover:text-white transition-colors duration-200"
                    >
                      View Details
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Jobs;
