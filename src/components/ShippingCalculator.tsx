import React from "react";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import ShippingForm, { ShippingFormData, ShippingFormRef } from "./shipping/ShippingForm";
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
  const [showDeliveryAddress, setShowDeliveryAddress] = React.useState(false);
  const formRef = React.useRef<ShippingFormRef>(null);

  const handleSubmit = (data: ShippingFormData) => {
    setCurrentData(data);
    setShowDeliveryAddress(false);
    setShowConfirmation(true);
  };

  const handleConfirm = () => {
    setShowDeliveryAddress(true);
  };

  const handleClose = () => {
    setShowConfirmation(false);
    setShowDeliveryAddress(false);
    setCurrentData(null);
    if (formRef.current) {
      formRef.current.reset();
    }
  };

  const handleDialogClose = (open: boolean) => {
    if (!open) {
      handleClose();
    }
  };

  return (
    <>
      <Card className="p-6 bg-white shadow-lg">
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Ship to Ethiopia</h2>
            <p className="text-gray-600">Calculate your shipping costs based on package weight.</p>
          </div>

          <ShippingForm onSubmit={handleSubmit} ref={formRef} />
          <PricingGuide />
        </div>
      </Card>

      <AlertDialog open={showConfirmation} onOpenChange={handleDialogClose}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {showDeliveryAddress ? "Delivery Instructions" : "Confirm Shipping Details"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {!showDeliveryAddress && currentData ? (
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
              ) : (
                <div className="space-y-3">
                  <p className="font-medium">Please deliver your items to:</p>
                  <div className="bg-gray-50 p-4 rounded-md text-lg">
                    ADOT International Market<br />
                    3111 Chillum Road<br />
                    Mount Rainer, MD
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    Make sure to bring your items during business hours.
                  </p>
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleClose}>
              {showDeliveryAddress ? "Close" : "Cancel"}
            </AlertDialogCancel>
            {!showDeliveryAddress && (
              <AlertDialogAction onClick={handleConfirm}>
                Confirm Details
              </AlertDialogAction>
            )}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default ShippingCalculator;