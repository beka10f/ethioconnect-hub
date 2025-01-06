import { useEffect, useState } from "react";
import Portal from "./Portal";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { MapPin, DollarSign } from "lucide-react";
import { Button } from "./ui/button";
import RentalDetails from "./RentalDetails";

type RentalListing = {
  id: string;
  title: string;
  price: number;
  address: string;
  description: string;
  contact_info: string;
  phone_number: string;
  created_at: string;
};

const RentalsPortal = () => {
  const [rentals, setRentals] = useState<RentalListing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRentalId, setSelectedRentalId] = useState<string | null>(null);

  useEffect(() => {
    const fetchRentals = async () => {
      try {
        const { data, error } = await supabase
          .from("rentals")
          .select("id, title, price, address, description, contact_info, phone_number, created_at")
          .eq("status", "approved")
          .order("created_at", { ascending: false })
          .limit(4);

        if (error) throw error;
        setRentals(data || []);
      } catch (error) {
        console.error("Error fetching rentals:", error);
        toast.error("Failed to load rental listings");
      } finally {
        setIsLoading(false);
      }
    };

    fetchRentals();

    const channel = supabase
      .channel("portal-rentals")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "rentals",
          filter: "status=eq.approved",
        },
        () => {
          fetchRentals();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  if (isLoading) {
    return (
      <Portal title="Featured Rentals">
        <div className="flex justify-start items-center h-24">
          <p className="text-sm text-gray-600">Loading rentals...</p>
        </div>
      </Portal>
    );
  }

  return (
    <Portal title="Featured Rentals">
      <div className="flex flex-col space-y-3">
        {rentals.map((rental) => (
          <div 
            key={rental.id} 
            className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-100"
          >
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">
                  {rental.title}
                </h3>
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="w-4 h-4 mr-1" />
                  {rental.address}
                </div>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center text-sm font-medium text-gray-900">
                  <DollarSign className="w-4 h-4 mr-1 text-site-blue" />
                  ${rental.price}/month
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="text-xs px-3 py-1 h-7 border-site-blue text-site-blue hover:bg-site-blue hover:text-white"
                  onClick={() => setSelectedRentalId(rental.id)}
                >
                  View Details
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <Link to="/rentals" className="block mt-4">
        <Button 
          className="w-full bg-site-blue hover:bg-site-blue/90 text-white"
          variant="default"
        >
          View All Rentals
        </Button>
      </Link>
      {selectedRentalId && (
        <RentalDetails id={selectedRentalId} onClose={() => setSelectedRentalId(null)} />
      )}
    </Portal>
  );
};

export default RentalsPortal;