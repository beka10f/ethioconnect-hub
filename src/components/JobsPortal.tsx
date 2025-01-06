import { useEffect, useState } from "react";
import Portal from "./Portal";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Building2, MapPin, Clock } from "lucide-react";

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
          <p className="text-gray-600">Loading jobs...</p>
        </div>
      </Portal>
    );
  }

  return (
    <Portal title="Recent Job Postings">
      <div className="space-y-4">
        <Link to="/jobs" className="inline-block mb-2">
          <button className="bg-blue-600 text-white px-4 py-1.5 text-sm rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium">
            View All Jobs
          </button>
        </Link>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {jobs.map((job) => (
            <Link to={`/jobs/${job.id}`} key={job.id}>
              <div className="group p-3 bg-white border border-gray-200 rounded-lg hover:border-blue-200 transition-all duration-200 hover:shadow-md h-full">
                <h3 className="text-base font-semibold text-gray-900 group-hover:text-blue-600 transition-colors mb-2 line-clamp-1">
                  {job.title}
                </h3>
                <div className="space-y-1.5">
                  <div className="flex items-center gap-1.5 text-sm text-gray-700">
                    <Building2 className="w-3.5 h-3.5 text-blue-500" />
                    <span className="line-clamp-1">{job.company_name}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-sm text-gray-700">
                    <MapPin className="w-3.5 h-3.5 text-blue-500" />
                    <span className="line-clamp-1">{job.location}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-gray-500">
                    <Clock className="w-3.5 h-3.5" />
                    <span>
                      {new Date(job.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  {job.description && (
                    <p className="text-sm text-gray-600 line-clamp-1 mt-1">
                      {job.description}
                    </p>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </Portal>
  );
};

export default JobsPortal;