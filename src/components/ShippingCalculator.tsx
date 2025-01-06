import React from "react";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import ShippingForm, { ShippingFormData } from "./shipping/ShippingForm";
import PricingGuide from "./shipping/PricingGuide";
import { calculateShippingCost } from "@/utils/shipping";

const ShippingCalculator = () => {
  const { toast } = useToast();

  const handleSubmit = (data: ShippingFormData) => {
    const cost = calculateShippingCost(data);
    toast({
      title: "Shipping Details Confirmed",
      description: (
        <div className="space-y-2">
          <p>Hello {data.name}, your estimated shipping cost is ${cost}.</p>
          <div className="mt-2">
            <p className="font-semibold">Your Details:</p>
            <p>Phone: {data.phoneNumber}</p>
            <p>Planned Drop-off: {format(data.shippingDate, 'MMMM do, yyyy')}</p>
          </div>
          <div className="mt-2">
            <p className="font-semibold">Drop-off Location:</p>
            <p>3111 Chillum Road</p>
            <p>Mount Rainer, MD</p>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            Please note: The weight will be verified at drop-off and final pricing may adjust if discrepancies arise.
          </p>
        </div>
      ),
      duration: 10000,
    });
  };

  return (
    <Card className="p-6 bg-white shadow-lg">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Ship to Ethiopia</h2>
          <p className="text-gray-600">Calculate your shipping costs based on package weight.</p>
        </div>

        <ShippingForm onSubmit={handleSubmit} />
        <PricingGuide />
      </div>
    </Card>
  );
};

export default ShippingCalculator;