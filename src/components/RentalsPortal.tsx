import { useEffect, useState } from "react";
import Portal from "./Portal";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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

    // Set up real-time subscription for approved rentals
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
      <div className="space-y-6 text-left">
        {rentals.map((rental) => (
          <Link to="/rentals" key={rental.id}>
            <div className="group p-4 -mx-4 border-b last:border-0 border-gray-200/30 hover:bg-white/50 rounded-lg transition-all duration-200">
              <h3 className="text-lg font-semibold text-ethiopian-coffee group-hover:text-ethiopian-coffee/80 transition-colors mb-2">
                {rental.title}
              </h3>
              <p className="text-sm text-ethiopian-coffee/60 mb-1">{rental.address}</p>
              <p className="text-base font-medium text-ethiopian-coffee/90">
                ${rental.price}/mo
              </p>
            </div>
          </Link>
        ))}
        <Link to="/rentals" className="block pt-2">
          <button className="w-full bg-ethiopian-coffee/90 text-white py-3 rounded-xl hover:bg-ethiopian-coffee transition-colors duration-200">
            View All Rentals
          </button>
        </Link>
      </div>
    </Portal>
  );
};

export default RentalsPortal;