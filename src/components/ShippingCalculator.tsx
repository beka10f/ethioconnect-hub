import React from "react";
import { Card } from "@/components/ui/card";
import ShippingForm, { ShippingFormData } from "./shipping/ShippingForm";
import PricingGuide from "./shipping/PricingGuide";
import { calculateShippingCost } from "@/utils/shipping";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { MapPin } from "lucide-react";

const ShippingCalculator = () => {
  const [showSummary, setShowSummary] = React.useState(false);
  const [currentData, setCurrentData] = React.useState<ShippingFormData | null>(null);

  const handleSubmit = (data: ShippingFormData) => {
    setCurrentData(data);
    setShowSummary(true);
  };

  const handleLocationClick = () => {
    window.open(
      "https://www.google.com/maps/search/?api=1&query=ADOT+International+Market+3111+Chillum+Road+Mount+Rainer+MD",
      "_blank"
    );
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

      <Dialog open={showSummary} onOpenChange={setShowSummary}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Shipping Details Summary</DialogTitle>
            <DialogDescription>
              {currentData && (
                <div className="mt-4 space-y-4">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="font-medium">Name:</div>
                    <div>{currentData.name}</div>
                    
                    <div className="font-medium">Phone Number:</div>
                    <div>{currentData.phoneNumber}</div>
                    
                    <div className="font-medium">Package Weight:</div>
                    <div>{currentData.weight} {currentData.unit}</div>
                    
                    <div className="font-medium">Drop-off Date:</div>
                    <div>{format(currentData.shippingDate, "MMMM do, yyyy")}</div>
                    
                    <div className="font-medium">Estimated Cost:</div>
                    <div className="text-primary font-semibold">
                      ${calculateShippingCost(currentData)}
                    </div>
                  </div>

                  <div 
                    className="bg-blue-50 p-4 rounded-lg mt-4 cursor-pointer hover:bg-blue-100 transition-colors group"
                    onClick={handleLocationClick}
                  >
                    <div className="flex items-start gap-2">
                      <MapPin className="w-5 h-5 text-blue-700 mt-0.5 group-hover:animate-bounce" />
                      <div className="text-sm">
                        <p className="text-blue-700 mb-1">
                          Please drop off your package at:
                        </p>
                        <p className="text-blue-700 font-semibold">
                          ADOT International Market<br />
                          3111 Chillum Road<br />
                          Mount Rainer, MD
                        </p>
                        <p className="text-blue-500 mt-2 font-medium underline">
                          Click here for directions →
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSummary(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ShippingCalculator;