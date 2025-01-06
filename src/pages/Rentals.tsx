import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Home, MapPin, DollarSign, Calendar, Mail, Phone } from "lucide-react";

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
      <div className="min-h-screen bg-ethiopian-cream">
        <Header />
        <main className="container mx-auto py-8 px-4">
          <div className="flex justify-center items-center h-64">
            <div className="animate-pulse text-ethiopian-coffee">Loading rentals...</div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ethiopian-cream">
      <Header />
      <main className="container mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-ethiopian-coffee mb-2">Rental Listings</h1>
            <p className="text-ethiopian-charcoal/60">Find your perfect home in our community</p>
          </div>
          <Link to="/post-rental">
            <Button className="bg-ethiopian-coffee hover:bg-ethiopian-coffee/90 text-white">
              <Home className="w-4 h-4 mr-2" />
              Post a Rental
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rentalListings.map((rental) => (
            <div
              key={rental.id}
              className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-200 overflow-hidden group"
            >
              <div className="p-6 space-y-4">
                <div>
                  <h3 className="text-xl font-semibold text-ethiopian-coffee group-hover:text-ethiopian-gold transition-colors">
                    {rental.title}
                  </h3>
                  <div className="flex items-center mt-2 text-ethiopian-gold font-semibold">
                    <DollarSign className="w-5 h-5 mr-1" />
                    <span className="text-lg">${rental.price}/month</span>
                  </div>
                </div>

                <div className="space-y-2 text-sm text-ethiopian-charcoal/70">
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-1.5 text-ethiopian-sage" />
                    {rental.address}
                  </div>
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1.5 text-ethiopian-sage" />
                    {new Date(rental.created_at).toLocaleDateString()}
                  </div>
                </div>

                <p className="text-ethiopian-charcoal/80 line-clamp-3">
                  {rental.description}
                </p>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center text-ethiopian-charcoal/70">
                    <Mail className="w-4 h-4 mr-1.5 text-ethiopian-sage" />
                    {rental.contact_info}
                  </div>
                  <div className="flex items-center text-ethiopian-charcoal/70">
                    <Phone className="w-4 h-4 mr-1.5 text-ethiopian-sage" />
                    {rental.phone_number}
                  </div>
                </div>

                <Link to={`/rentals/${rental.id}`}>
                  <Button className="w-full bg-ethiopian-coffee/90 hover:bg-ethiopian-coffee text-white transition-colors duration-200">
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