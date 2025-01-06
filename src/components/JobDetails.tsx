import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

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
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">{job.title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <h4 className="font-medium text-gray-900">Company</h4>
            <p className="text-gray-700 mt-1">{job.company_name}</p>
          </div>
          <div>
            <h4 className="font-medium text-gray-900">Description</h4>
            <p className="text-gray-700 mt-1">{job.description}</p>
          </div>
          <div>
            <h4 className="font-medium text-gray-900">Location</h4>
            <p className="text-gray-700 mt-1">{job.location}</p>
          </div>
          <div>
            <h4 className="font-medium text-gray-900">Contact Information</h4>
            <p className="text-gray-700 mt-1">Email: {job.contact_info}</p>
            <p className="text-gray-700">Phone: {job.phone_number}</p>
          </div>
          <div className="flex justify-end pt-4">
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