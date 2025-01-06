import { ShippingFormData } from "@/components/shipping/ShippingForm";

export const calculateShippingCost = (data: ShippingFormData) => {
  const weight = parseFloat(data.weight);
  let cost = 0;

  if (data.unit === "kg") {
    if (weight <= 3) {
      cost = 45;
    } else if (weight <= 10) {
      cost = weight * 18;
    } else {
      cost = weight * 15;
    }
  } else {
    if (weight <= 6) {
      cost = 45;
    } else if (weight <= 22) {
      cost = weight * 8.16;
    } else {
      cost = weight * 6.8;
    }
  }

  return Math.round(cost * 100) / 100;
};