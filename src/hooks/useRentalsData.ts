import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export type RentalStatus = 'pending' | 'approved' | 'rejected';

export const useRentalsData = (status: RentalStatus) => {
  const [rentals, setRentals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchRentals = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("rentals")
        .select("*")
        .eq("status", status)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setRentals(data || []);
    } catch (error) {
      console.error("Error fetching rentals:", error);
      toast.error("Failed to fetch rentals");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRentals();

    const channel = supabase
      .channel('rentals-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'rentals',
          filter: `status=eq.${status}`
        },
        () => {
          fetchRentals();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [status]);

  return { rentals, isLoading, refetch: fetchRentals };
};