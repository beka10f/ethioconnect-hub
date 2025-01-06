import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Briefcase, MapPin, Calendar, Mail, Phone, Building2, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

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
    <div className="min-h-screen bg-white">
      <Header />
      <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-black">Job Listings</h1>
            <p className="text-sm text-gray-600 mt-2">Find your next opportunity in our community</p>
          </div>
          <Link to="/post-job">
            <Button 
              size="lg"
              className={cn(
                "bg-blue-600 hover:bg-blue-700 text-white",
                "shadow-md hover:shadow-lg",
                "transition-all duration-200 ease-in-out",
                "flex items-center gap-2"
              )}
            >
              <Briefcase className="w-4 h-4" />
              Post a Job
            </Button>
          </Link>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-pulse text-blue-600">Loading jobs...</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {jobs.map((job) => (
              <div 
                key={job.id}
                className={cn(
                  "bg-white border border-gray-200 rounded-lg p-6",
                  "hover:border-blue-200 transition-colors duration-200",
                  "shadow-sm hover:shadow-md"
                )}
              >
                <div className="space-y-4">
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold text-black">
                        {job.title}
                      </h2>
                      <div className="flex items-center mt-2 text-blue-600">
                        <Building2 className="w-5 h-5 mr-2" />
                        <span className="font-medium">{job.company_name}</span>
                      </div>
                    </div>
                    <Link 
                      to={`/jobs/${job.id}`}
                      className={cn(
                        "text-blue-600 hover:text-blue-700",
                        "flex items-center gap-1.5 font-medium",
                        "transition-colors duration-200"
                      )}
                    >
                      View Details
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                  
                  <div className="flex flex-wrap gap-6 text-sm text-gray-600">
                    <div className="flex items-center">
                      <MapPin className="w-5 h-5 mr-2 text-blue-500" />
                      {job.location}
                    </div>
                    <div className="flex items-center">
                      <Calendar className="w-5 h-5 mr-2 text-blue-500" />
                      {new Date(job.created_at).toLocaleDateString()}
                    </div>
                  </div>

                  <p className="text-gray-600 text-base leading-relaxed">
                    {job.description}
                  </p>

                  <div className="border-t border-gray-100 pt-4">
                    <div className="flex flex-wrap gap-6 text-sm">
                      <div className="flex items-center text-gray-600">
                        <Mail className="w-5 h-5 mr-2 text-blue-500" />
                        {job.contact_info}
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Phone className="w-5 h-5 mr-2 text-blue-500" />
                        {job.phone_number}
                      </div>
                    </div>
                  </div>
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