import { useEffect, useState } from "react";
import Portal from "./Portal";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "./ui/button";
import JobDetails from "./JobDetails";

type JobListing = {
  id: string;
  title: string;
  company_name: string;
  location: string;
  description: string;
  created_at: string;
  contact_info: string;
  phone_number: string;
};

const JobsPortal = () => {
  const [jobs, setJobs] = useState<JobListing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const { data, error } = await supabase
          .from("jobs")
          .select("*")
          .eq("status", "approved")
          .order("created_at", { ascending: false })
          .limit(4);

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

    const channel = supabase
      .channel("portal-jobs")
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

  if (isLoading) {
    return (
      <Portal title="Recent Job Postings">
        <div className="flex justify-start items-center h-24">
          <p className="text-sm text-gray-600">Loading jobs...</p>
        </div>
      </Portal>
    );
  }

  return (
    <Portal title="Recent Job Postings">
      <div className="flex flex-col divide-y divide-gray-100">
        {jobs.map((job) => (
          <div 
            key={job.id} 
            className="py-3 px-1 flex items-center justify-between hover:bg-gray-50 transition-colors duration-200"
          >
            <div className="space-y-0.5">
              <h3 className="text-base font-medium text-gray-900 text-left">
                {job.title}
              </h3>
              <div className="text-sm text-gray-500">
                {job.location}
              </div>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              className="text-blue-600 border-blue-600 hover:bg-blue-50 hover:text-blue-700"
              onClick={() => setSelectedJobId(job.id)}
            >
              View Details
            </Button>
          </div>
        ))}
      </div>
      <Link to="/jobs" className="block mt-4">
        <Button 
          className="w-full bg-site-blue hover:bg-site-blue/90 text-white"
          variant="default"
        >
          View All Jobs
        </Button>
      </Link>
      {selectedJobId && (
        <JobDetails 
          id={selectedJobId} 
          onClose={() => setSelectedJobId(null)} 
        />
      )}
    </Portal>
  );
};

export default JobsPortal;