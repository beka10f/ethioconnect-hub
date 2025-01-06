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
import { MapPin, Package, Calendar, Phone, User, DollarSign } from "lucide-react";

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
      <div className="w-full px-4 sm:px-6">
        <Card className="p-4 sm:p-6 bg-white shadow-lg">
          <div className="space-y-4 sm:space-y-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Ship to Ethiopia</h2>
              <p className="text-sm sm:text-base text-gray-600">Calculate your shipping costs based on package weight.</p>
            </div>

            <ShippingForm onSubmit={handleSubmit} />
            <PricingGuide />
          </div>
        </Card>
      </div>

      <Dialog open={showSummary} onOpenChange={setShowSummary}>
        <DialogContent className="w-[95vw] max-w-[425px] p-4 sm:p-6">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl font-semibold text-site-blue">
              Shipping Details
            </DialogTitle>
          </DialogHeader>
          {currentData && (
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-site-blue/5 p-3 rounded-lg">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-site-blue flex-shrink-0" />
                    <p className="text-sm text-gray-900 font-medium truncate">{currentData.name}</p>
                  </div>
                </div>

                <div className="bg-site-blue/5 p-3 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-site-blue flex-shrink-0" />
                    <p className="text-sm text-gray-900 font-medium truncate">{currentData.phoneNumber}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-site-blue/5 p-3 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Package className="w-4 h-4 text-site-blue flex-shrink-0" />
                    <p className="text-sm text-gray-900 font-medium">
                      {currentData.weight} {currentData.unit}
                    </p>
                  </div>
                </div>

                <div className="bg-site-blue/5 p-3 rounded-lg">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-site-blue flex-shrink-0" />
                    <p className="text-sm text-gray-900 font-medium">
                      ${calculateShippingCost(currentData)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-site-blue/5 p-3 rounded-lg">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-site-blue flex-shrink-0" />
                  <p className="text-sm text-gray-900 font-medium">
                    {format(currentData.shippingDate, "MMM do, yyyy")}
                  </p>
                </div>
              </div>

              <div 
                className="bg-gradient-to-r from-site-blue/5 to-site-blue/10 p-3 rounded-lg cursor-pointer 
                         hover:from-site-blue/10 hover:to-site-blue/20 transition-all duration-300
                         border border-site-blue/20 group"
                onClick={handleLocationClick}
              >
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-site-blue flex-shrink-0 group-hover:animate-bounce" />
                  <div>
                    <p className="text-sm text-gray-900 font-medium">
                      ADOT International Market<br />
                      3111 Chillum Road, Mount Rainer, MD
                    </p>
                    <p className="text-xs text-site-blue mt-1 flex items-center gap-1 group-hover:gap-2 transition-all">
                      Click for directions 
                      <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter className="mt-2">
            <Button 
              variant="outline" 
              onClick={() => setShowSummary(false)}
              className="w-full sm:w-auto border-site-blue text-site-blue hover:bg-site-blue hover:text-white"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ShippingCalculator;