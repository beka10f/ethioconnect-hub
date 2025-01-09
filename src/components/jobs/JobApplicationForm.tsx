import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { FormField } from "@/components/forms/FormField";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface JobApplicationFormProps {
  jobId: string;
  onCancel: () => void;
}

type ApplicationFormData = {
  full_name: string;
  email: string;
  phone: string;
  cover_letter: string;
};

export const JobApplicationForm = ({ jobId, onCancel }: JobApplicationFormProps) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ApplicationFormData>();

  const onSubmit = async (data: ApplicationFormData) => {
    try {
      const { error } = await supabase
        .from("job_applications")
        .insert([
          {
            job_id: jobId,
            ...data,
          },
        ]);

      if (error) throw error;

      toast.success("Application submitted successfully!");
      reset();
      onCancel();
    } catch (error) {
      console.error("Error submitting application:", error);
      toast.error("Failed to submit application");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-left">
      <FormField
        label="Full Name"
        id="full_name"
        placeholder="Enter your full name"
        registration={register("full_name", { required: "Full name is required" })}
        error={errors.full_name?.message}
        className="w-full h-11 border-gray-200 bg-white focus:border-site-blue focus:ring-site-blue/20 rounded-xl"
      />

      <FormField
        label="Email"
        id="email"
        type="email"
        placeholder="your.email@example.com"
        registration={register("email", {
          required: "Email is required",
          pattern: {
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            message: "Invalid email address",
          },
        })}
        error={errors.email?.message}
        className="w-full h-11 border-gray-200 bg-white focus:border-site-blue focus:ring-site-blue/20 rounded-xl"
      />

      <FormField
        label="Phone Number"
        id="phone"
        placeholder="Enter your phone number"
        registration={register("phone", { required: "Phone number is required" })}
        error={errors.phone?.message}
        className="w-full h-11 border-gray-200 bg-white focus:border-site-blue focus:ring-site-blue/20 rounded-xl"
      />

      <div className="space-y-2">
        <Label htmlFor="cover_letter" className="text-gray-900 font-medium">
          Cover Letter
        </Label>
        <Textarea
          id="cover_letter"
          {...register("cover_letter")}
          className="w-full min-h-[100px] border-gray-200 bg-white focus:border-site-blue focus:ring-site-blue/20 rounded-xl resize-none"
          placeholder="Tell us why you're interested in this position..."
        />
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
          className="border-gray-200 hover:bg-gray-50"
        >
          Back
        </Button>
        <Button
          type="submit"
          className="bg-site-blue hover:bg-site-blue/90 text-white"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting..." : "Submit Application"}
        </Button>
      </div>
    </form>
  );
};