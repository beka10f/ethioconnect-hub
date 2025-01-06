import { useEffect, useState } from "react";
import Portal from "./Portal";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { MapPin, DollarSign } from "lucide-react";

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
      <div className="flex flex-col space-y-2">
        {rentals.map((rental) => (
          <Link to={`/rentals/${rental.id}`} key={rental.id} className="block w-full">
            <div className="group bg-white border border-gray-200 rounded-lg p-3 hover:border-blue-200 transition-all duration-200 hover:shadow-sm w-full">
              <h3 className="text-sm font-medium text-gray-900 truncate">
                {rental.title}
              </h3>
              <div className="flex items-center gap-4 mt-1 text-xs text-gray-600">
                <div className="flex items-center gap-1">
                  <DollarSign className="w-3 h-3" />
                  <span>${rental.price}/mo</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  <span>{rental.address}</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
      <Link to="/rentals" className="block mt-3">
        <button className="w-full bg-blue-600 text-white py-1.5 text-sm rounded-lg hover:bg-blue-700 transition-colors duration-200">
          View All Rentals
        </button>
      </Link>
    </Portal>
  );
};

export default RentalsPortal;