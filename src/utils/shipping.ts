import { ShippingFormData } from "@/components/shipping/ShippingForm";

export const calculateShippingCost = (data: ShippingFormData) => {
  const weight = parseFloat(data.weight);
  let cost = 0;

  if (data.unit === "kg") {
    // Convert kg to lbs for calculation (1 kg ≈ 2.20462 lbs)
    const weightInLbs = weight * 2.20462;
    cost = weightInLbs * 5;
  } else {
    // Direct calculation for pounds
    cost = weight * 5;
  }

  return Math.round(cost * 100) / 100;
};