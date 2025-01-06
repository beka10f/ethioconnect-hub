import { useEffect, useState } from "react";
import Portal from "./Portal";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { MapPin, Building2 } from "lucide-react";

type JobListing = {
  id: string;
  title: string;
  company_name: string;
  location: string;
  description: string;
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
          .select("id, title, company_name, location, description, created_at")
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
      <div className="grid grid-cols-2 gap-3">
        {jobs.map((job) => (
          <Link to={`/jobs/${job.id}`} key={job.id} className="block">
            <div className="group bg-white border border-gray-200 rounded-lg p-2.5 hover:border-blue-200 transition-all duration-200 hover:shadow-sm h-full">
              <h3 className="text-sm font-medium text-gray-900 truncate mb-0.5">
                {job.title}
              </h3>
              <div className="flex items-center gap-3 text-xs text-gray-600">
                <div className="flex items-center gap-1">
                  <Building2 className="w-3 h-3 text-blue-500" />
                  <span className="truncate">{job.company_name}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-blue-500" />
                  <span className="truncate">{job.location}</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
      <Link to="/jobs" className="block mt-3">
        <button className="w-full bg-blue-600 text-white py-2 text-sm rounded-lg hover:bg-blue-700 transition-colors duration-200">
          View All Jobs
        </button>
      </Link>
    </Portal>
  );
};

export default JobsPortal;