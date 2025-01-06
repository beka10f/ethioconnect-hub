import React from "react";
import { Card } from "@/components/ui/card";
import ShippingForm, { ShippingFormData } from "./shipping/ShippingForm";
import PricingGuide from "./shipping/PricingGuide";
import { calculateShippingCost } from "@/utils/shipping";

const ShippingCalculator = () => {
  const handleSubmit = (data: ShippingFormData) => {
    const cost = calculateShippingCost(data);
    alert(`Estimated shipping cost: $${cost}`);
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