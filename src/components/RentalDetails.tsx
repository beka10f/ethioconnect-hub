import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

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
  const { id } = useParams();
  const navigate = useNavigate();
  const [rental, setRental] = useState<Rental | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRental = async () => {
      try {
        const { data, error } = await supabase
          .from("rentals")
          .select("*")
          .eq("id", id)
          .eq("status", "approved")
          .single();

        if (error) throw error;
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

  if (isLoading) {
    return null;
  }

  if (!rental) {
    return null;
  }

  return (
    <Dialog open={true} onOpenChange={() => navigate("/rentals")}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">{rental.title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <h4 className="font-medium text-gray-900">Price</h4>
            <p className="text-gray-700 mt-1">${rental.price}/month</p>
          </div>
          <div>
            <h4 className="font-medium text-gray-900">Description</h4>
            <p className="text-gray-700 mt-1">{rental.description}</p>
          </div>
          <div>
            <h4 className="font-medium text-gray-900">Address</h4>
            <p className="text-gray-700 mt-1">{rental.address}</p>
          </div>
          <div>
            <h4 className="font-medium text-gray-900">Contact Information</h4>
            <p className="text-gray-700 mt-1">Email: {rental.contact_info}</p>
            <p className="text-gray-700">Phone: {rental.phone_number}</p>
          </div>
          <div className="flex justify-end pt-4">
            <Button variant="outline" onClick={() => navigate("/rentals")}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RentalDetails;