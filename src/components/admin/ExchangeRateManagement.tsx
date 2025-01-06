import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

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
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Update Exchange Rate</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <Input
                type="number"
                step="0.01"
                placeholder="Enter new rate (ETB per 1 USD)"
                value={rate}
                onChange={(e) => setRate(e.target.value)}
                className="w-full"
              />
            </div>
            <Button type="submit" disabled={isSubmitting}>
              Update Rate
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ExchangeRateManagement;