import React from "react";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import ShippingForm, { ShippingFormData } from "./shipping/ShippingForm";
import PricingGuide from "./shipping/PricingGuide";
import { calculateShippingCost } from "@/utils/shipping";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const ShippingCalculator = () => {
  const { toast } = useToast();
  const [showConfirmation, setShowConfirmation] = React.useState(false);
  const [currentData, setCurrentData] = React.useState<ShippingFormData | null>(null);

  const handleSubmit = (data: ShippingFormData) => {
    setCurrentData(data);
    setShowConfirmation(true);
  };

  const handleConfirm = () => {
    if (!currentData) return;
    
    const cost = calculateShippingCost(currentData);
    
    toast({
      title: "Drop-off Location Confirmed",
      description: (
        <>
          <span className="block font-semibold mb-1">Please bring your items to:</span>
          <span className="block bg-slate-50 p-3 rounded-md">
            ADOT International Market<br />
            3111 Chillum Road<br />
            Mount Rainer, MD
          </span>
          
          <span className="block font-semibold mt-4 mb-1">Shipping Details:</span>
          <span className="block bg-slate-50 p-3 rounded-md">
            Name: {currentData.name}<br />
            Phone: {currentData.phoneNumber}<br />
            Drop-off Date: {format(currentData.shippingDate, "MMMM do, yyyy")}<br />
            Package Weight: {currentData.weight} {currentData.unit}<br />
            <span className="font-medium text-green-600">Estimated Cost: ${cost}</span>
          </span>
          
          <span className="block text-sm text-muted-foreground mt-2">
            Note: The weight will be verified at drop-off and final pricing may adjust accordingly.
          </span>
        </>
      ),
      duration: 10000,
    });
    setShowConfirmation(false);
  };

  return (
    <>
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

      <AlertDialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Shipping Details</AlertDialogTitle>
            <AlertDialogDescription>
              {currentData && (
                <div className="space-y-2">
                  <p>Please review your shipping details:</p>
                  <div className="bg-gray-50 p-4 rounded-md space-y-1">
                    <p><span className="font-medium">Name:</span> {currentData.name}</p>
                    <p><span className="font-medium">Phone:</span> {currentData.phoneNumber}</p>
                    <p><span className="font-medium">Weight:</span> {currentData.weight} {currentData.unit}</p>
                    <p><span className="font-medium">Drop-off Date:</span> {format(currentData.shippingDate, "MMMM do, yyyy")}</p>
                    <p><span className="font-medium">Estimated Cost:</span> ${calculateShippingCost(currentData)}</p>
                  </div>
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction type="button" onClick={handleConfirm}>
              Confirm Details
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default ShippingCalculator;