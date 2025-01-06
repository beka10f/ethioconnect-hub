import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { MapPin, Calendar, Mail, Phone } from "lucide-react";

type Job = {
  id: string;
  title: string;
  company_name: string;
  location: string;
  description: string;
  contact_info: string;
  phone_number: string;
  created_at: string;
};

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState<Job | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const { data, error } = await supabase
          .from("jobs")
          .select("*")
          .eq("id", id)
          .eq("status", "approved")
          .single();

        if (error) throw error;
        setJob(data);
      } catch (error) {
        console.error("Error fetching job:", error);
        toast.error("Failed to load job details");
        navigate("/jobs");
      } finally {
        setIsLoading(false);
      }
    };

    fetchJob();
  }, [id, navigate]);

  if (isLoading || !job) {
    return null;
  }

  return (
    <Dialog open={true} onOpenChange={() => navigate("/jobs")}>
      <DialogContent className="sm:max-w-[500px] p-0">
        <div className="p-6 space-y-6">
          <div>
            <h2 className="text-xl font-semibold text-[#0066CC] mb-1">{job.company_name}</h2>
            <h3 className="text-lg text-gray-900">{job.title}</h3>
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

          <div className="prose prose-sm max-w-none">
            <p className="text-gray-600">{job.description}</p>
          </div>

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

          <div className="flex justify-end pt-4">
            <Button 
              variant="outline" 
              onClick={() => navigate("/jobs")}
              className="text-sm px-4 py-2"
            >
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default JobDetails;