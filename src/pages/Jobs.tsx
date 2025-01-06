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
      <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl font-semibold text-black mb-3">Job Listings</h1>
            <p className="text-lg text-gray-500">Find your next opportunity in our community</p>
          </div>
          <Link to="/post-job">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-6 py-2.5 rounded-full transition-all duration-300 shadow-sm">
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
          <div className="grid gap-4">
            {jobs.map((job) => (
              <Link to={`/jobs/${job.id}`} key={job.id}>
                <div className="group bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200/50">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                    <div className="flex-1 space-y-4">
                      <div>
                        <h2 className="text-2xl font-semibold text-black group-hover:text-blue-600 transition-colors">
                          {job.title}
                        </h2>
                        <p className="text-lg text-blue-600 font-medium mt-1">{job.company_name}</p>
                      </div>
                      
                      <div className="flex flex-wrap gap-6 text-[15px] text-gray-500">
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-2 stroke-[1.5]" />
                          {job.location}
                        </div>
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-2 stroke-[1.5]" />
                          {new Date(job.created_at).toLocaleDateString()}
                        </div>
                      </div>
                      
                      <p className="text-gray-600 line-clamp-2 text-[15px] leading-relaxed">
                        {job.description}
                      </p>
                      
                      <div className="flex flex-wrap gap-6 text-[15px] text-gray-500 pt-2">
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
                    
                    <div className="flex items-center">
                      <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
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
