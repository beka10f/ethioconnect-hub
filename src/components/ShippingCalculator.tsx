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
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center text-blue-900">
              Shipping Details Summary
            </DialogTitle>
            <DialogDescription>
              {currentData && (
                <div className="mt-6 space-y-6">
                  <div className="grid gap-4">
                    <div className="bg-gradient-to-r from-blue-50/50 to-blue-50/30 p-4 rounded-lg flex items-center gap-3">
                      <User className="w-5 h-5 text-blue-600 shrink-0" />
                      <div>
                        <p className="text-sm text-blue-600 font-medium">Name</p>
                        <p className="text-blue-900 font-semibold">{currentData.name}</p>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-blue-50/50 to-blue-50/30 p-4 rounded-lg flex items-center gap-3">
                      <Phone className="w-5 h-5 text-blue-600 shrink-0" />
                      <div>
                        <p className="text-sm text-blue-600 font-medium">Phone Number</p>
                        <p className="text-blue-900 font-semibold">{currentData.phoneNumber}</p>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-blue-50/50 to-blue-50/30 p-4 rounded-lg flex items-center gap-3">
                      <Package className="w-5 h-5 text-blue-600 shrink-0" />
                      <div>
                        <p className="text-sm text-blue-600 font-medium">Package Weight</p>
                        <p className="text-blue-900 font-semibold">
                          {currentData.weight} {currentData.unit}
                        </p>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-blue-50/50 to-blue-50/30 p-4 rounded-lg flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-blue-600 shrink-0" />
                      <div>
                        <p className="text-sm text-blue-600 font-medium">Drop-off Date</p>
                        <p className="text-blue-900 font-semibold">
                          {format(currentData.shippingDate, "MMMM do, yyyy")}
                        </p>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-blue-50/50 to-blue-50/30 p-4 rounded-lg flex items-center gap-3">
                      <DollarSign className="w-5 h-5 text-blue-600 shrink-0" />
                      <div>
                        <p className="text-sm text-blue-600 font-medium">Estimated Cost</p>
                        <p className="text-blue-900 font-semibold">
                          ${calculateShippingCost(currentData)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div 
                    className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-xl cursor-pointer 
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