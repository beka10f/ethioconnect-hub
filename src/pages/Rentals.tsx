import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type RentalListing = {
  id: string;
  title: string;
  price: number;
  address: string;
  description: string;
  created_at: string;
};

const Rentals = () => {
  const [rentalListings, setRentalListings] = useState<RentalListing[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRentals = async () => {
      try {
        const { data, error } = await supabase
          .from("rentals")
          .select("*")
          .eq("status", "approved")
          .order("created_at", { ascending: false });

        if (error) throw error;
        setRentalListings(data || []);
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
      .channel("approved-rentals")
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
      <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-blue-50">
        <Header />
        <main className="container mx-auto py-8 px-4">
          <div className="flex justify-center items-center h-64">
            <p className="text-gray-600">Loading rentals...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-blue-50">
      <Header />
      <main className="container mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Rental Listings</h1>
          <Link to="/post-rental">
            <Button className="bg-blue-600 hover:bg-blue-700">
              Post a Rental
            </Button>
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rentalListings.map((rental) => (
            <div
              key={rental.id}
              className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              <div className="p-4">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {rental.title}
                </h3>
                <p className="text-blue-600 font-bold mb-2">${rental.price}/month</p>
                <p className="text-gray-600 mb-1">{rental.address}</p>
                <p className="text-gray-700 mb-4 line-clamp-2">
                  {rental.description}
                </p>
                <Link to={`/rentals/${rental.id}`}>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">
                    View Details
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Rentals;