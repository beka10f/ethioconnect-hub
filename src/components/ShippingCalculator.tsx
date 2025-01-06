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
import { MapPin, Package, Calendar, Phone, User, DollarSign, Receipt, Camera } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const ShippingCalculator = () => {
  const [showSummary, setShowSummary] = React.useState(false);
  const [showReceipt, setShowReceipt] = React.useState(false);
  const [currentData, setCurrentData] = React.useState<ShippingFormData | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [confirmationId, setConfirmationId] = React.useState<string>("");
  const { toast } = useToast();

  const handleSubmit = (data: ShippingFormData) => {
    setCurrentData(data);
    setShowSummary(true);
  };

  const handleConfirmShipping = async () => {
    if (!currentData) return;
    
    setIsSubmitting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { data, error } = await supabase
        .from('shipping_details')
        .insert({
          customer_name: currentData.name,
          phone: currentData.phoneNumber,
          weight: parseFloat(currentData.weight),
          weight_unit: currentData.unit,
          cost: calculateShippingCost(currentData),
          shipping_date: format(currentData.shippingDate, 'yyyy-MM-dd'),
          status: 'pending',
          created_by: user?.id || null
        })
        .select()
        .single();

      if (error) throw error;

      setConfirmationId(data.id);
      setShowSummary(false);
      setShowReceipt(true);
      
      toast({
        title: "Shipping request confirmed!",
        description: "Please save your receipt for reference.",
      });
    } catch (error) {
      console.error('Error saving shipping details:', error);
      toast({
        title: "Error saving shipping details",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLocationClick = () => {
    window.open(
      "https://www.google.com/maps/search/?api=1&query=ADOT+International+Market+3111+Chillum+Road+Mount+Rainer+MD",
      "_blank"
    );
  };

  return (
    <>
      <div id="shipping-calculator" className="w-full mx-auto px-0">
        <Card className="w-full p-4 sm:p-6 bg-white shadow-lg">
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

      {/* Review Dialog */}
      <Dialog open={showSummary} onOpenChange={setShowSummary}>
        <DialogContent className="w-[95vw] max-w-[425px] p-4 sm:p-6">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl font-semibold text-site-blue">
              Review Shipping Details
            </DialogTitle>
            <DialogDescription>
              Please review your shipping details before confirming.
            </DialogDescription>
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
          <DialogFooter className="mt-2 space-x-2">
            <Button 
              variant="outline" 
              onClick={() => setShowSummary(false)}
              disabled={isSubmitting}
              className="border-site-blue text-site-blue hover:bg-site-blue hover:text-white"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleConfirmShipping}
              disabled={isSubmitting}
              className="bg-site-blue hover:bg-site-blue/90 text-white"
            >
              {isSubmitting ? "Saving..." : "Confirm Shipping"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Receipt Dialog */}
      <Dialog open={showReceipt} onOpenChange={setShowReceipt}>
        <DialogContent className="w-[95vw] max-w-[425px] p-4 sm:p-6">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl font-semibold text-site-blue flex items-center gap-2">
              <Receipt className="w-5 h-5" />
              Shipping Receipt
            </DialogTitle>
            <DialogDescription className="flex items-center gap-2 text-site-blue">
              <Camera className="w-4 h-4" />
              Please take a screenshot of this receipt for your records
            </DialogDescription>
          </DialogHeader>
          {currentData && (
            <div className="space-y-4 bg-white rounded-lg border border-gray-200 p-4">
              <div className="text-center border-b border-gray-200 pb-3">
                <h3 className="font-bold text-lg text-gray-900">ADOT International Market</h3>
                <p className="text-sm text-gray-600">3111 Chillum Road, Mount Rainer, MD</p>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Confirmation ID:</span>
                  <span className="font-medium text-gray-900">{confirmationId.slice(0, 8)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Customer:</span>
                  <span className="font-medium text-gray-900">{currentData.name}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Phone:</span>
                  <span className="font-medium text-gray-900">{currentData.phoneNumber}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Package Weight:</span>
                  <span className="font-medium text-gray-900">{currentData.weight} {currentData.unit}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Drop-off Date:</span>
                  <span className="font-medium text-gray-900">{format(currentData.shippingDate, "MMM do, yyyy")}</span>
                </div>
                <div className="flex justify-between text-sm border-t border-gray-200 pt-2 mt-2">
                  <span className="font-semibold text-gray-900">Total Cost:</span>
                  <span className="font-bold text-site-blue">${calculateShippingCost(currentData)}</span>
                </div>
              </div>

              <div className="text-center text-xs text-gray-500 mt-4 pt-4 border-t border-gray-200">
                <p>Thank you for choosing ADOT International Market</p>
                <p>For any questions, please contact us with your confirmation ID</p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button 
              onClick={() => setShowReceipt(false)}
              className="w-full bg-site-blue hover:bg-site-blue/90 text-white"
            >
              Done
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ShippingCalculator;