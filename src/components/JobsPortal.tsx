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
          <p className="text-gray-600">Loading jobs...</p>
        </div>
      </Portal>
    );
  }

  return (
    <Portal title="Recent Job Postings">
      <div className="space-y-6 text-left">
        {jobs.map((job) => (
          <Link to={`/jobs/${job.id}`} key={job.id}>
            <div className="group p-6 bg-white border border-gray-200 rounded-lg hover:border-blue-200 transition-all duration-200 hover:shadow-md">
              <h3 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors mb-3">
                {job.title}
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-gray-700">
                  <Building2 className="w-4 h-4 text-blue-500" />
                  <span>{job.company_name}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <MapPin className="w-4 h-4 text-blue-500" />
                  <span>{job.location}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-500">
                  <Clock className="w-4 h-4" />
                  <span>
                    {new Date(job.created_at).toLocaleDateString()}
                  </span>
                </div>
                {job.description && (
                  <p className="text-gray-600 line-clamp-2 mt-2">
                    {job.description}
                  </p>
                )}
              </div>
            </div>
          </Link>
        ))}
        <Link to="/jobs" className="block mt-8">
          <button className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition-colors duration-200 font-medium">
            View All Jobs
          </button>
        </Link>
      </div>
    </Portal>
  );
};

export default JobsPortal;