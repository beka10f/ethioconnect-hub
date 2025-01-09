import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { DollarSign, MapPin, Mail, Phone, Calendar } from "lucide-react";
import { useForm } from "react-hook-form";
import { FormField } from "@/components/forms/FormField";

type Rental = {
  id: string;
  title: string;
  address: string;
  price: number;
  description: string;
  contact_info: string;
  phone_number: string;
  created_at: string;
};

interface RentalDetailsProps {
  id?: string;
  onClose?: () => void;
}

type ApplicationFormData = {
  full_name: string;
  email: string;
  phone: string;
  message: string;
};

const RentalDetails = ({ id, onClose }: RentalDetailsProps) => {
  const [rental, setRental] = useState<Rental | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<ApplicationFormData>();

  useEffect(() => {
    const fetchRental = async () => {
      try {
        if (!id) {
          throw new Error("No rental ID provided");
        }

        const { data, error } = await supabase
          .from("rentals")
          .select("*")
          .eq("id", id)
          .eq("status", "approved")
          .maybeSingle();

        if (error) throw error;
        if (!data) {
          toast.error("Rental not found");
          onClose?.();
          return;
        }
        
        setRental(data);
      } catch (error) {
        console.error("Error fetching rental:", error);
        toast.error("Failed to load rental details");
        onClose?.();
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchRental();
    }
  }, [id, onClose]);

  const onSubmitApplication = async (data: ApplicationFormData) => {
    try {
      const { error } = await supabase
        .from("rental_applications")
        .insert([
          {
            rental_id: id,
            ...data,
          },
        ]);

      if (error) throw error;

      toast.success("Application submitted successfully!");
      setShowApplicationForm(false);
      reset();
    } catch (error) {
      console.error("Error submitting application:", error);
      toast.error("Failed to submit application");
    }
  };

  if (isLoading || !rental) {
    return null;
  }

  return (
    <Dialog open={true} onOpenChange={() => onClose?.()}>
      <DialogContent className="sm:max-w-[600px] text-left bg-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold text-gray-900">{rental.title}</DialogTitle>
        </DialogHeader>
        
        {!showApplicationForm ? (
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-site-blue" />
              <span className="text-xl font-semibold text-gray-900">${rental.price}/month</span>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium text-gray-900">Description</h4>
              <p className="text-gray-700">{rental.description}</p>
            </div>

            <div className="flex items-start gap-2">
              <MapPin className="w-5 h-5 text-site-blue mt-1" />
              <div>
                <h4 className="font-medium text-gray-900">Address</h4>
                <p className="text-gray-700">{rental.address}</p>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">Contact Information</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-site-blue" />
                  <span className="text-gray-700">{rental.contact_info}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-site-blue" />
                  <span className="text-gray-700">{rental.phone_number}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-site-blue" />
                  <span className="text-gray-500 text-sm">
                    Listed on {new Date(rental.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button 
                variant="outline" 
                onClick={() => onClose?.()}
                className="border-gray-200 text-gray-700 hover:bg-gray-50"
              >
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
          <div className="space-y-6">
            <form onSubmit={handleSubmit(onSubmitApplication)} className="space-y-4">
              <FormField
                label="Full Name"
                id="full_name"
                placeholder="Enter your full name"
                registration={register("full_name", { required: "Full name is required" })}
                error={errors.full_name?.message}
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
              />

              <FormField
                label="Phone Number"
                id="phone"
                placeholder="Enter your phone number"
                registration={register("phone", { required: "Phone number is required" })}
                error={errors.phone?.message}
              />

              <FormField
                label="Message (Optional)"
                id="message"
                placeholder="Add any additional information..."
                registration={register("message")}
                error={errors.message?.message}
                textarea
              />

              <div className="flex justify-end gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowApplicationForm(false)}
                  disabled={isSubmitting}
                  className="border-gray-200 text-gray-700 hover:bg-gray-50"
                >
                  Back
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-site-blue hover:bg-site-blue/90 text-white"
                >
                  {isSubmitting ? "Submitting..." : "Submit Application"}
                </Button>
              </div>
            </form>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default RentalDetails;