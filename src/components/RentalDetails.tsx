import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { DollarSign, MapPin, Mail, Phone, Calendar } from "lucide-react";

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

const RentalDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [rental, setRental] = useState<Rental | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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
          navigate("/rentals");
          return;
        }
        
        setRental(data);
      } catch (error) {
        console.error("Error fetching rental:", error);
        toast.error("Failed to load rental details");
        navigate("/rentals");
      } finally {
        setIsLoading(false);
      }
    };

    fetchRental();
  }, [id, navigate]);

  if (isLoading || !rental) {
    return null;
  }

  return (
    <Dialog open={true} onOpenChange={() => navigate("/rentals")}>
      <DialogContent className="sm:max-w-[600px] text-left bg-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold text-gray-900">{rental.title}</DialogTitle>
        </DialogHeader>
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

          <div className="flex justify-end pt-4">
            <Button 
              variant="outline" 
              onClick={() => navigate("/rentals")}
              className="border-site-blue text-site-blue hover:bg-site-blue hover:text-white"
            >
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RentalDetails;