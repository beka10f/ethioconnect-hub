import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Home, MapPin, DollarSign, Calendar, Mail, Phone, ChevronRight } from "lucide-react";

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
    <div className="min-h-screen bg-[#f5f5f7]">
      <Header />
      <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl font-semibold text-black mb-3">Rental Listings</h1>
            <p className="text-lg text-gray-500">Find your perfect home in our community</p>
          </div>
          <Link to="/post-rental">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-6 py-2.5 rounded-full transition-all duration-300 shadow-sm">
              <Home className="w-4 h-4 mr-2" />
              Post a Rental
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-pulse text-blue-600">Loading rentals...</div>
          </div>
        ) : (
          <div className="grid gap-4">
            {rentalListings.map((rental) => (
              <Link to={`/rentals/${rental.id}`} key={rental.id}>
                <div className="group bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200/50">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                    <div className="flex-1 space-y-4">
                      <div>
                        <h2 className="text-2xl font-semibold text-black group-hover:text-blue-600 transition-colors">
                          {rental.title}
                        </h2>
                        <div className="flex items-center mt-2">
                          <DollarSign className="w-5 h-5 text-blue-600 stroke-[1.5]" />
                          <span className="text-lg font-medium text-blue-600">${rental.price}/month</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-6 text-[15px] text-gray-500">
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-2 stroke-[1.5]" />
                          {rental.address}
                        </div>
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-2 stroke-[1.5]" />
                          {new Date(rental.created_at).toLocaleDateString()}
                        </div>
                      </div>

                      <p className="text-gray-600 line-clamp-2 text-[15px] leading-relaxed">
                        {rental.description}
                      </p>

                      <div className="flex flex-wrap gap-6 text-[15px] text-gray-500 pt-2">
                        <div className="flex items-center">
                          <Mail className="w-4 h-4 mr-2 stroke-[1.5]" />
                          {rental.contact_info}
                        </div>
                        <div className="flex items-center">
                          <Phone className="w-4 h-4 mr-2 stroke-[1.5]" />
                          {rental.phone_number}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Rentals;