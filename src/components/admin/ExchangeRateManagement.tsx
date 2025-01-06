import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DollarSign } from "lucide-react";

const ExchangeRateManagement = () => {
  const [rate, setRate] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rate) {
      toast.error("Please enter a rate");
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from("exchange_rates")
        .insert([{ rate: parseFloat(rate) }]);

      if (error) throw error;

      toast.success("Exchange rate updated successfully");
      setRate("");
    } catch (error) {
      console.error("Error updating exchange rate:", error);
      toast.error("Failed to update exchange rate");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="relative">
        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-ethiopian-coffee/60 h-4 w-4" />
        <Input
          type="number"
          step="0.01"
          placeholder="Enter new rate (ETB per 1 USD)"
          value={rate}
          onChange={(e) => setRate(e.target.value)}
          className="pl-10 border-ethiopian-sage/20 focus:ring-ethiopian-coffee/30"
        />
      </div>
      <Button 
        type="submit" 
        disabled={isSubmitting}
        className="w-full bg-ethiopian-coffee hover:bg-ethiopian-coffee/90 text-white"
      >
        {isSubmitting ? "Updating..." : "Update Exchange Rate"}
      </Button>
    </form>
  );
};

export default ExchangeRateManagement;