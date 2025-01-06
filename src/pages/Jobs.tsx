import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Briefcase, MapPin, Calendar, Mail, Phone, ChevronRight } from "lucide-react";

type Job = {
  id: string;
  title: string;
  company_name: string;
  location: string;
  description: string;
  contact_info: string;
  created_at: string;
  phone_number: string;
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
    <div className="min-h-screen bg-[#f5f5f7]">
      <Header />
      <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8 max-w-3xl">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-semibold text-gray-900 tracking-tight">Job Listings</h1>
            <p className="text-base text-gray-500 mt-1">Find your next opportunity</p>
          </div>
          <Link to="/post-job">
            <Button className="bg-[#0066CC] hover:bg-[#0055B3] text-white text-sm px-4 py-2 rounded-lg">
              Post a Job
            </Button>
          </Link>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-pulse text-[#0066CC]">Loading jobs...</div>
          </div>
        ) : (
          <div className="space-y-4">
            {jobs.map((job) => (
              <Link to={`/jobs/${job.id}`} key={job.id}>
                <div className="bg-white rounded-xl p-6 transition-all duration-200 hover:shadow-md border border-gray-200">
                  <div className="space-y-4">
                    <div>
                      <h2 className="text-xl font-semibold text-[#0066CC] mb-1">
                        {job.company_name}
                      </h2>
                      <h3 className="text-lg text-gray-900">
                        {job.title}
                      </h3>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3 text-sm text-gray-500">
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-2 stroke-[1.5]" />
                        {job.location}
                      </div>
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2 stroke-[1.5]" />
                        {new Date(job.created_at).toLocaleDateString()}
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {job.description}
                    </p>
                    
                    <div className="grid grid-cols-2 gap-3 text-sm text-gray-500">
                      <div className="flex items-center">
                        <Mail className="w-4 h-4 mr-2 stroke-[1.5]" />
                        {job.contact_info}
                      </div>
                      <div className="flex items-center">
                        <Phone className="w-4 h-4 mr-2 stroke-[1.5]" />
                        {job.phone_number}
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Jobs;