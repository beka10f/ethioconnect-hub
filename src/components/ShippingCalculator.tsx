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
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-blue-900">
              Shipping Details
            </DialogTitle>
          </DialogHeader>
          {currentData && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-blue-50/50 p-3 rounded-lg">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-blue-600" />
                    <p className="text-sm text-blue-900 font-medium">{currentData.name}</p>
                  </div>
                </div>

                <div className="bg-blue-50/50 p-3 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-blue-600" />
                    <p className="text-sm text-blue-900 font-medium">{currentData.phoneNumber}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-blue-50/50 p-3 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Package className="w-4 h-4 text-blue-600" />
                    <p className="text-sm text-blue-900 font-medium">
                      {currentData.weight} {currentData.unit}
                    </p>
                  </div>
                </div>

                <div className="bg-blue-50/50 p-3 rounded-lg">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-blue-600" />
                    <p className="text-sm text-blue-900 font-medium">
                      ${calculateShippingCost(currentData)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50/50 p-3 rounded-lg">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-blue-600" />
                  <p className="text-sm text-blue-900 font-medium">
                    {format(currentData.shippingDate, "MMM do, yyyy")}
                  </p>
                </div>
              </div>

              <div 
                className="bg-gradient-to-r from-blue-50 to-blue-100 p-3 rounded-lg cursor-pointer 
                         hover:from-blue-100 hover:to-blue-200 transition-all duration-300
                         border border-blue-200 group"
                onClick={handleLocationClick}
              >
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-blue-600 group-hover:animate-bounce" />
                  <div>
                    <p className="text-sm text-blue-900 font-medium">
                      ADOT International Market<br />
                      3111 Chillum Road, Mount Rainer, MD
                    </p>
                    <p className="text-xs text-blue-600 mt-1 flex items-center gap-1 group-hover:gap-2 transition-all">
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
              className="w-full sm:w-auto"
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