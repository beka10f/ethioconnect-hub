import React from "react";
import { format } from "date-fns";
import { MapPin, Package, Calendar, Phone, User, DollarSign } from "lucide-react";
import { ShippingFormData } from "./ShippingForm";
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

interface ShippingSummaryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: ShippingFormData | null;
  onConfirm: () => void;
  isSubmitting: boolean;
}

const ShippingSummaryDialog = ({
  open,
  onOpenChange,
  data,
  onConfirm,
  isSubmitting,
}: ShippingSummaryDialogProps) => {
  const handleLocationClick = () => {
    window.open(
      "https://www.google.com/maps/search/?api=1&query=ADOT+International+Market+3111+Chillum+Road+Mount+Rainer+MD",
      "_blank"
    );
  };

  if (!data) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-[425px] p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl font-semibold text-site-blue">
            Review Shipping Details
          </DialogTitle>
          <DialogDescription>
            Please review your shipping details before confirming.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-site-blue/5 p-3 rounded-lg">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-site-blue flex-shrink-0" />
                <p className="text-sm text-gray-900 font-medium truncate">{data.name}</p>
              </div>
            </div>

            <div className="bg-site-blue/5 p-3 rounded-lg">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-site-blue flex-shrink-0" />
                <p className="text-sm text-gray-900 font-medium truncate">{data.phoneNumber}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-site-blue/5 p-3 rounded-lg">
              <div className="flex items-center gap-2">
                <Package className="w-4 h-4 text-site-blue flex-shrink-0" />
                <p className="text-sm text-gray-900 font-medium">
                  {data.weight} {data.unit}
                </p>
              </div>
            </div>

            <div className="bg-site-blue/5 p-3 rounded-lg">
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-site-blue flex-shrink-0" />
                <p className="text-sm text-gray-900 font-medium">
                  ${calculateShippingCost(data)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-site-blue/5 p-3 rounded-lg">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-site-blue flex-shrink-0" />
              <p className="text-sm text-gray-900 font-medium">
                {format(data.shippingDate, "MMM do, yyyy")}
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
        <DialogFooter className="mt-2 space-x-2">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
            className="border-site-blue text-site-blue hover:bg-site-blue hover:text-white"
          >
            Cancel
          </Button>
          <Button 
            onClick={onConfirm}
            disabled={isSubmitting}
            className="bg-site-blue hover:bg-site-blue/90 text-white"
          >
            {isSubmitting ? "Saving..." : "Confirm Shipping"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ShippingSummaryDialog;