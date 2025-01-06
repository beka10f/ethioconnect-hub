import { useEffect, useState } from "react";
import Portal from "./Portal";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { DollarSign, MapPin } from "lucide-react";

type RentalListing = {
  id: string;
  title: string;
  price: number;
  address: string;
};

const RentalsPortal = () => {
  const [rentals, setRentals] = useState<RentalListing[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRentals = async () => {
      try {
        const { data, error } = await supabase
          .from("rentals")
          .select("id, title, price, address")
          .eq("status", "approved")
          .order("created_at", { ascending: false })
          .limit(3);

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
        <div className="flex justify-start items-center h-32">
          <p className="text-gray-500">Loading rentals...</p>
        </div>
      </Portal>
    );
  }

  return (
    <Portal title="Featured Rentals">
      <div className="space-y-4 text-left">
        {rentals.map((rental) => (
          <Link to={`/rentals/${rental.id}`} key={rental.id}>
            <div className="group border border-gray-100 rounded-lg p-4 hover:border-blue-100 hover:bg-blue-50/30 transition-all duration-200">
              <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                {rental.title}
              </h3>
              <div className="mt-2 space-y-2">
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm">{rental.address}</span>
                </div>
                <div className="flex items-center gap-1 text-blue-600 font-medium">
                  <DollarSign className="w-4 h-4" />
                  <span>${rental.price}/mo</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
        <Link to="/rentals" className="block mt-6">
          <button className="w-full bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-700 transition-colors duration-200">
            View All Rentals
          </button>
        </Link>
      </div>
    </Portal>
  );
};

export default RentalsPortal;