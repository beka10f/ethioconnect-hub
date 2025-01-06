import { useEffect, useState } from "react";
import Portal from "./Portal";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { MapPin, ArrowRight } from "lucide-react";

type RentalListing = {
  id: string;
  title: string;
  price: number;
  address: string;
  description: string;
  created_at: string;
};

const RentalsPortal = () => {
  const [rentals, setRentals] = useState<RentalListing[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRentals = async () => {
      try {
        const { data, error } = await supabase
          .from("rentals")
          .select("id, title, price, address, description, created_at")
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
      <div className="flex flex-col space-y-4">
        {rentals.map((rental) => (
          <div key={rental.id} className="flex items-center justify-between w-full group">
            <div className="flex-1">
              <h3 className="text-base font-medium text-gray-900">{rental.title}</h3>
              <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  <span>{rental.address}</span>
                </div>
                <span>${rental.price}/mo</span>
              </div>
            </div>
            <Link 
              to={`/rentals/${rental.id}`}
              className="flex items-center gap-1 text-blue-600 hover:text-blue-700 transition-colors"
            >
              Details
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ))}
      </div>
      <Link 
        to="/rentals" 
        className="inline-flex items-center gap-1 mt-4 text-blue-600 hover:text-blue-700 transition-colors"
      >
        View All Rentals
        <ArrowRight className="w-4 h-4" />
      </Link>
    </Portal>
  );
};

export default RentalsPortal;