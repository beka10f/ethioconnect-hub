import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { MapPin, Mail, Phone, Calendar, Building2 } from "lucide-react";
import { useForm } from "react-hook-form";

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

type ApplicationForm = {
  full_name: string;
  email: string;
  phone: string;
  cover_letter: string;
};

const JobDetails = ({ id, onClose }: JobDetailsProps) => {
  const [job, setJob] = useState<Job | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ApplicationForm>();

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
        onClose?.();
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchJob();
    }
  }, [id, onClose]);

  const onSubmit = async (data: ApplicationForm) => {
    if (!job?.id) return;
    
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from("job_applications")
        .insert([
          {
            job_id: job.id,
            ...data
          }
        ]);

      if (error) throw error;

      toast.success("Application submitted successfully!");
      reset();
      setShowApplicationForm(false);
    } catch (error) {
      console.error("Error submitting application:", error);
      toast.error("Failed to submit application");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading || !job) {
    return null;
  }

  return (
    <Dialog open={true} onOpenChange={() => onClose?.()}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-left">{job.title}</DialogTitle>
        </DialogHeader>
        
        {!showApplicationForm ? (
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

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => onClose?.()}>
                Close
              </Button>
              <Button 
                onClick={() => setShowApplicationForm(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Apply Now
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-left">
            <div className="space-y-2">
              <Label htmlFor="full_name">Full Name</Label>
              <Input
                id="full_name"
                {...register("full_name", { required: "Full name is required" })}
                className="w-full"
                error={errors.full_name?.message}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                {...register("email", { 
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address"
                  }
                })}
                className="w-full"
                error={errors.email?.message}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                {...register("phone", { required: "Phone number is required" })}
                className="w-full"
                error={errors.phone?.message}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cover_letter">Cover Letter</Label>
              <Textarea
                id="cover_letter"
                {...register("cover_letter")}
                className="w-full min-h-[100px]"
              />
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button 
                type="button"
                variant="outline" 
                onClick={() => setShowApplicationForm(false)}
                disabled={isSubmitting}
              >
                Back
              </Button>
              <Button 
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Submit Application"}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default JobDetails;