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
    <div className="min-h-screen bg-ethiopian-cream">
      <Header />
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-ethiopian-coffee mb-2">Job Listings</h1>
            <p className="text-ethiopian-charcoal/60">Find your next opportunity in our community</p>
          </div>
          <Link to="/post-job">
            <Button className="bg-ethiopian-coffee hover:bg-ethiopian-coffee/90 text-white">
              <Briefcase className="w-4 h-4 mr-2" />
              Post a Job
            </Button>
          </Link>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-pulse text-ethiopian-coffee">Loading jobs...</div>
          </div>
        ) : (
          <div className="grid gap-6">
            {jobs.map((job) => (
              <div 
                key={job.id} 
                className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-200 p-6 border border-ethiopian-sage/10"
              >
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div className="flex-1 space-y-4">
                    <div>
                      <h2 className="text-xl font-semibold text-ethiopian-coffee group-hover:text-ethiopian-gold transition-colors">
                        {job.title}
                      </h2>
                      <p className="text-ethiopian-gold font-medium mt-1">{job.company_name}</p>
                    </div>
                    
                    <div className="flex flex-wrap gap-4 text-sm text-ethiopian-charcoal/70">
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1.5 text-ethiopian-sage" />
                        {job.location}
                      </div>
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1.5 text-ethiopian-sage" />
                        {new Date(job.created_at).toLocaleDateString()}
                      </div>
                    </div>
                    
                    <p className="text-ethiopian-charcoal/80 line-clamp-3">{job.description}</p>
                    
                    <div className="flex flex-wrap gap-4 text-sm">
                      <div className="flex items-center text-ethiopian-charcoal/70">
                        <Mail className="w-4 h-4 mr-1.5 text-ethiopian-sage" />
                        {job.contact_info}
                      </div>
                      <div className="flex items-center text-ethiopian-charcoal/70">
                        <Phone className="w-4 h-4 mr-1.5 text-ethiopian-sage" />
                        {job.phone_number}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex md:flex-col gap-4 md:ml-6">
                    <Link to={`/jobs/${job.id}`}>
                      <Button 
                        variant="outline" 
                        className="w-full border-ethiopian-coffee text-ethiopian-coffee hover:bg-ethiopian-coffee hover:text-white transition-colors duration-200"
                      >
                        View Details
                      </Button>
                    </Link>
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