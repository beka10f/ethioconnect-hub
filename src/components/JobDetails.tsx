import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { MapPin, Mail, Phone, Calendar, Building2 } from "lucide-react";

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

  if (isLoading) {
    return null;
  }

  if (!job) {
    return null;
  }

  return (
    <Dialog open={true} onOpenChange={() => navigate("/jobs")}>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-left">{job.title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 text-left">
          <div className="flex items-center text-blue-600">
            <Building2 className="w-4 h-4 mr-1.5" />
            <span className="font-medium">{job.company_name}</span>
          </div>
          
          <div className="grid gap-2 text-sm text-gray-600">
            <div className="flex items-center">
              <MapPin className="w-3.5 h-3.5 mr-1.5 text-gray-400 flex-shrink-0" />
              <span>{job.location}</span>
            </div>
            <div className="flex items-center">
              <Calendar className="w-3.5 h-3.5 mr-1.5 text-gray-400 flex-shrink-0" />
              <span>{new Date(job.created_at).toLocaleDateString()}</span>
            </div>
          </div>

          <div className="pt-2">
            <h4 className="font-medium text-sm text-gray-900 mb-2">Description</h4>
            <p className="text-sm text-gray-600 whitespace-pre-wrap">{job.description}</p>
          </div>

          <div className="border-t pt-4">
            <h4 className="font-medium text-sm text-gray-900 mb-2">Contact Information</h4>
            <div className="grid gap-2 text-sm">
              <div className="flex items-center text-gray-600">
                <Mail className="w-3.5 h-3.5 mr-1.5 text-gray-400 flex-shrink-0" />
                <span>{job.contact_info}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <Phone className="w-3.5 h-3.5 mr-1.5 text-gray-400 flex-shrink-0" />
                <span>{job.phone_number}</span>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <Button variant="outline" onClick={() => navigate("/jobs")}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default JobDetails;