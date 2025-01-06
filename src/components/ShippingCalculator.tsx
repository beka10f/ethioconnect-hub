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
                    className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-xl mt-6 cursor-pointer 
                             hover:from-blue-100 hover:to-blue-200 transition-all duration-300 shadow-sm 
                             border border-blue-200 group"
                    onClick={handleLocationClick}
                  >
                    <div className="flex items-start gap-3">
                      <MapPin className="w-6 h-6 text-blue-600 mt-1 group-hover:animate-bounce" />
                      <div>
                        <h4 className="text-blue-800 font-medium mb-2">
                          Drop-off Location
                        </h4>
                        <p className="text-blue-900 font-semibold leading-relaxed">
                          ADOT International Market<br />
                          3111 Chillum Road<br />
                          Mount Rainer, MD
                        </p>
                        <p className="text-blue-600 mt-3 font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                          Click here for directions 
                          <span className="group-hover:translate-x-1 transition-transform">→</span>
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