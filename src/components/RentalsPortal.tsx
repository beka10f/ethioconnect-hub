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
      <div className="flex flex-col space-y-1">
        {rentals.map((rental) => (
          <Link to={`/rentals/${rental.id}`} key={rental.id} className="block w-full">
            <div className="group hover:bg-gray-50 py-2 px-1">
              <div className="flex items-center gap-2 text-sm">
                <span className="font-medium text-gray-900">{rental.title}</span>
                <span className="text-gray-500">•</span>
                <span className="text-gray-600">${rental.price}/mo</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
      <Link to="/rentals" className="block mt-3">
        <button className="w-full text-left text-sm text-blue-600 hover:text-blue-700 py-1">
          View All Rentals →
        </button>
      </Link>
    </Portal>
  );
};

export default RentalsPortal;
