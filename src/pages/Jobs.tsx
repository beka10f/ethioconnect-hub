import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Briefcase, MapPin, Calendar, Mail, Phone } from "lucide-react";

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
      <div className="max-w-3xl mx-auto py-6 px-4">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Job Listings</h1>
            <p className="text-sm text-gray-600">Find your next opportunity in our community</p>
          </div>
          <Link to="/post-job">
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Briefcase className="w-4 h-4 mr-2" />
              Post a Job
            </Button>
          </Link>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-pulse text-blue-600">Loading jobs...</div>
          </div>
        ) : (
          <div className="space-y-3">
            {jobs.map((job) => (
              <div 
                key={job.id} 
                className="bg-white border border-gray-200 rounded-lg p-3 hover:shadow-sm transition-shadow duration-200"
              >
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1 min-w-0 text-left">
                    <h2 className="text-base font-semibold text-gray-900 mb-0.5">
                      {job.title}
                    </h2>
                    <p className="text-blue-600 text-sm font-medium mb-1">{job.company_name}</p>
                    
                    <div className="grid grid-cols-1 gap-1 text-sm text-gray-600 mb-2">
                      <div className="flex items-center">
                        <MapPin className="w-3.5 h-3.5 mr-1 text-gray-400" />
                        {job.location}
                      </div>
                      <div className="flex items-center">
                        <Calendar className="w-3.5 h-3.5 mr-1 text-gray-400" />
                        {new Date(job.created_at).toLocaleDateString()}
                      </div>
                    </div>
                    
                    <p className="text-gray-600 text-sm mb-2 line-clamp-2">{job.description}</p>
                    
                    <div className="grid grid-cols-1 gap-1 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Mail className="w-3.5 h-3.5 mr-1 text-gray-400" />
                        {job.contact_info}
                      </div>
                      <div className="flex items-center">
                        <Phone className="w-3.5 h-3.5 mr-1 text-gray-400" />
                        {job.phone_number}
                      </div>
                    </div>
                  </div>
                  
                  <Link to={`/jobs/${job.id}`}>
                    <Button 
                      variant="outline"
                      className="whitespace-nowrap border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white"
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