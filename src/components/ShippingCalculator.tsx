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
      title: "Drop-off Location Confirmed",
      description: (
        <div className="space-y-4">
          <div>
            <span className="block font-semibold mb-1">Please bring your items to:</span>
            <span className="block bg-slate-50 p-3 rounded-md">
              ADOT International Market<br />
              3111 Chillum Road<br />
              Mount Rainer, MD
            </span>
          </div>
          
          <div>
            <span className="block font-semibold mb-1">Shipping Details:</span>
            <span className="block bg-slate-50 p-3 rounded-md">
              Name: {data.name}<br />
              Phone: {data.phoneNumber}<br />
              Drop-off Date: {format(data.shippingDate, "MMMM do, yyyy")}<br />
              Package Weight: {data.weight} {data.unit}<br />
              <span className="font-medium text-green-600">Estimated Cost: ${cost}</span>
            </span>
          </div>
          
          <span className="block text-sm text-muted-foreground">
            Note: The weight will be verified at drop-off and final pricing may adjust accordingly.
          </span>
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