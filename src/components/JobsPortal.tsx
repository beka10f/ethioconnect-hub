import { useEffect, useState } from "react";
import Portal from "./Portal";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Building2, MapPin } from "lucide-react";

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
      <div className="flex flex-col space-y-1">
        {jobs.map((job) => (
          <Link to={`/jobs/${job.id}`} key={job.id} className="block w-full">
            <div className="group hover:bg-gray-50 py-2 px-1">
              <div className="flex items-center gap-2 text-sm">
                <span className="font-medium text-gray-900">{job.title}</span>
                <span className="text-gray-500">•</span>
                <span className="text-gray-600">{job.company_name}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
      <Link to="/jobs" className="block mt-3">
        <button className="w-full text-left text-sm text-blue-600 hover:text-blue-700 py-1">
          View All Jobs →
        </button>
      </Link>
    </Portal>
  );
};

export default JobsPortal;
