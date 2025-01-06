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
          <p className="text-ethiopian-charcoal">Loading rentals...</p>
        </div>
      </Portal>
    );
  }

  return (
    <Portal title="Featured Rentals">
      <div className="space-y-6 text-left">
        {rentals.map((rental) => (
          <Link to={`/rentals/${rental.id}`} key={rental.id}>
            <div className="group p-4 border border-gray-100 rounded-xl hover:border-ethiopian-sage/30 hover:bg-ethiopian-cream/5 transition-all duration-200">
              <h3 className="text-xl font-semibold text-ethiopian-coffee group-hover:text-ethiopian-gold transition-colors mb-2">
                {rental.title}
              </h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-ethiopian-charcoal">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm">{rental.address}</span>
                </div>
                <div className="flex items-center gap-2 text-ethiopian-coffee font-medium">
                  <DollarSign className="w-4 h-4" />
                  <span>${rental.price}/mo</span>
                </div>
                <div className="flex items-center gap-2 text-ethiopian-charcoal/80">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm">
                    {new Date(rental.created_at).toLocaleDateString()}
                  </span>
                </div>
                {rental.description && (
                  <p className="text-sm text-ethiopian-charcoal/70 line-clamp-2 mt-2">
                    {rental.description}
                  </p>
                )}
              </div>
            </div>
          </Link>
        ))}
        <Link to="/rentals" className="block mt-8">
          <button className="w-full bg-ethiopian-coffee text-white py-3 rounded-xl hover:bg-ethiopian-coffee/90 transition-colors duration-200">
            View All Rentals
          </button>
        </Link>
      </div>
    </Portal>
  );
};

export default RentalsPortal;