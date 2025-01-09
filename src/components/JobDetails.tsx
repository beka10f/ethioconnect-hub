import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { MapPin, Mail, Phone, Calendar, Building2 } from "lucide-react";
import { JobApplicationForm } from "./jobs/JobApplicationForm";

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

interface JobDetailsProps {
  id?: string;
  onClose?: () => void;
}

const JobDetails = ({ id, onClose }: JobDetailsProps) => {
  const [job, setJob] = useState<Job | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [open, setOpen] = useState(true);

  useEffect(() => {
    const fetchJob = async () => {
      if (!id) return;
      
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
        onClose?.();
      } finally {
        setIsLoading(false);
      }
    };

    fetchJob();
  }, [id, onClose]);

  const handleOpenChange = (open: boolean) => {
    setOpen(open);
    if (!open) {
      onClose?.();
    }
  };

  if (isLoading || !job) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-left">
            {job.title}
          </DialogTitle>
          <DialogDescription className="text-blue-600 flex items-center">
            <Building2 className="w-4 h-4 mr-1.5" />
            <span className="font-medium">{job.company_name}</span>
          </DialogDescription>
        </DialogHeader>

        {!showApplicationForm ? (
          <div className="space-y-4 text-left">
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
              <p className="text-sm text-gray-600 whitespace-pre-wrap">
                {job.description}
              </p>
            </div>

            <div className="border-t pt-4">
              <h4 className="font-medium text-sm text-gray-900 mb-2">
                Contact Information
              </h4>
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

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => onClose?.()}>
                Close
              </Button>
              <Button
                onClick={() => setShowApplicationForm(true)}
                className="bg-site-blue hover:bg-site-blue/90 text-white"
              >
                Apply Now
              </Button>
            </div>
          </div>
        ) : (
          <JobApplicationForm
            jobId={job.id}
            onCancel={() => setShowApplicationForm(false)}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default JobDetails;