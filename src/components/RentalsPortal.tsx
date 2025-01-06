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
        <div className="flex justify-center items-center h-32">
          <p className="text-gray-600">Loading rentals...</p>
        </div>
      </Portal>
    );
  }

  return (
    <Portal title="Featured Rentals">
      <div className="space-y-4">
        {rentals.map((rental) => (
          <div key={rental.id} className="group border-b border-gray-100/50 last:border-0 pb-3 hover:bg-blue-50/50 rounded-lg transition-colors duration-200 -mx-2 px-2">
            <h3 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">{rental.title}</h3>
            <p className="text-sm text-gray-600">{rental.address}</p>
            <p className="text-sm font-medium text-blue-600">${rental.price}/mo</p>
          </div>
        ))}
        <Link to="/rentals">
          <button className="w-full mt-4 bg-blue-600/90 backdrop-blur-sm text-white py-2.5 rounded-xl hover:bg-blue-700 transition-colors duration-200">
            View All Rentals
          </button>
        </Link>
      </div>
    </Portal>
  );
};

export default RentalsPortal;