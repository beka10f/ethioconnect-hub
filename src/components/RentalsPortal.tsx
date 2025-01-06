import { useEffect, useState } from "react";
import Portal from "./Portal";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { DollarSign, MapPin, Clock } from "lucide-react";

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
          <p className="text-gray-600">Loading rentals...</p>
        </div>
      </Portal>
    );
  }

  return (
    <Portal title="Featured Rentals">
      <div className="space-y-4">
        <Link to="/rentals" className="inline-block mb-2">
          <button className="bg-blue-600 text-white px-4 py-1.5 text-sm rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium">
            View All Rentals
          </button>
        </Link>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {rentals.map((rental) => (
            <Link to={`/rentals/${rental.id}`} key={rental.id}>
              <div className="group p-3 bg-white border border-gray-200 rounded-lg hover:border-blue-200 transition-all duration-200 hover:shadow-md h-full">
                <h3 className="text-base font-semibold text-gray-900 group-hover:text-blue-600 transition-colors mb-2 line-clamp-1">
                  {rental.title}
                </h3>
                <div className="space-y-1.5">
                  <div className="flex items-center gap-1.5 text-sm text-gray-700">
                    <MapPin className="w-3.5 h-3.5 text-blue-500" />
                    <span className="line-clamp-1">{rental.address}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-sm text-gray-900 font-medium">
                    <DollarSign className="w-3.5 h-3.5 text-blue-500" />
                    <span>${rental.price}/mo</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-gray-500">
                    <Clock className="w-3.5 h-3.5" />
                    <span>
                      {new Date(rental.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  {rental.description && (
                    <p className="text-sm text-gray-600 line-clamp-1 mt-1">
                      {rental.description}
                    </p>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </Portal>
  );
};

export default RentalsPortal;