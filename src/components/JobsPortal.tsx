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
          <p className="text-ethiopian-charcoal">Loading jobs...</p>
        </div>
      </Portal>
    );
  }

  return (
    <Portal title="Recent Job Postings">
      <div className="space-y-6 text-left">
        {jobs.map((job) => (
          <Link to={`/jobs/${job.id}`} key={job.id}>
            <div className="group p-4 border border-gray-100 rounded-xl hover:border-ethiopian-sage/30 hover:bg-ethiopian-cream/5 transition-all duration-200">
              <h3 className="text-xl font-semibold text-ethiopian-coffee group-hover:text-ethiopian-gold transition-colors mb-2">
                {job.title}
              </h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-ethiopian-charcoal">
                  <Building2 className="w-4 h-4" />
                  <span className="text-sm">{job.company_name}</span>
                </div>
                <div className="flex items-center gap-2 text-ethiopian-charcoal">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm">{job.location}</span>
                </div>
                <div className="flex items-center gap-2 text-ethiopian-charcoal/80">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm">
                    {new Date(job.created_at).toLocaleDateString()}
                  </span>
                </div>
                {job.description && (
                  <p className="text-sm text-ethiopian-charcoal/70 line-clamp-2 mt-2">
                    {job.description}
                  </p>
                )}
              </div>
            </div>
          </Link>
        ))}
        <Link to="/jobs" className="block mt-8">
          <button className="w-full bg-ethiopian-coffee text-white py-3 rounded-xl hover:bg-ethiopian-coffee/90 transition-colors duration-200">
            View All Jobs
          </button>
        </Link>
      </div>
    </Portal>
  );
};

export default JobsPortal;