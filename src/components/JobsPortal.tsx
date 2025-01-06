import { useEffect, useState } from "react";
import Portal from "./Portal";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type JobListing = {
  id: string;
  title: string;
  company_name: string;
  location: string;
  created_at: string;
};

const JobsPortal = () => {
  const [jobs, setJobs] = useState<JobListing[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const { data, error } = await supabase
          .from("jobs")
          .select("id, title, company_name, location, created_at")
          .eq("status", "approved")
          .order("created_at", { ascending: false })
          .limit(3);

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
        <div className="flex justify-start items-center h-32">
          <p className="text-gray-500">Loading jobs...</p>
        </div>
      </Portal>
    );
  }

  return (
    <Portal title="Recent Job Postings">
      <div className="space-y-4 text-left">
        {jobs.map((job) => (
          <Link to="/jobs" key={job.id}>
            <div className="group border-b border-gray-100/50 last:border-0 pb-4 hover:bg-blue-50/50 rounded-lg transition-colors duration-200">
              <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors mb-1">
                {job.title}
              </h3>
              <p className="text-sm text-gray-500">{job.company_name}</p>
              <p className="text-sm text-gray-400">{job.location}</p>
            </div>
          </Link>
        ))}
        <Link to="/jobs" className="block mt-4">
          <button className="w-full bg-blue-600/90 backdrop-blur-sm text-white py-2.5 rounded-xl hover:bg-blue-700 transition-colors duration-200">
            View All Jobs
          </button>
        </Link>
      </div>
    </Portal>
  );
};

export default JobsPortal;