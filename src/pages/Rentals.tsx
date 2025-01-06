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
            <Link
              to={`/rentals/${rental.id}`}
              key={rental.id}
              className="group bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden border border-ethiopian-coffee/10"
            >
              <div className="p-6 space-y-4">
                <div className="flex justify-between items-start">
                  <h3 className="text-xl font-semibold text-ethiopian-coffee group-hover:text-ethiopian-coffee/80 transition-colors line-clamp-2">
                    {rental.title}
                  </h3>
                  <div className="flex items-center bg-ethiopian-cream px-3 py-1.5 rounded-full">
                    <DollarSign className="w-4 h-4 text-ethiopian-coffee/70" />
                    <span className="font-semibold text-ethiopian-coffee">
                      ${rental.price}
                      <span className="text-sm text-ethiopian-coffee/70">/mo</span>
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 mt-1 flex-shrink-0 text-ethiopian-coffee/60" />
                    <p className="text-ethiopian-coffee/80 line-clamp-2">{rental.address}</p>
                  </div>
                  
                  <p className="text-ethiopian-coffee/70 line-clamp-3 text-sm">
                    {rental.description}
                  </p>

                  <div className="pt-4 border-t border-ethiopian-coffee/10">
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="flex items-center gap-1.5">
                        <Mail className="w-4 h-4 text-ethiopian-coffee/60" />
                        <span className="text-ethiopian-coffee/70 truncate">
                          {rental.contact_info}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Phone className="w-4 h-4 text-ethiopian-coffee/60" />
                        <span className="text-ethiopian-coffee/70 truncate">
                          {rental.phone_number}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm text-ethiopian-coffee/60">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4" />
                    <span>
                      Posted {new Date(rental.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <span className="text-ethiopian-coffee underline opacity-0 group-hover:opacity-100 transition-opacity">
                    View Details →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Rentals;