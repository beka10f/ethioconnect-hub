import React from "react";
import { format } from "date-fns";
import { Receipt, Camera } from "lucide-react";
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

interface ShippingReceiptDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: ShippingFormData | null;
  confirmationId: string;
}

const ShippingReceiptDialog = ({
  open,
  onOpenChange,
  data,
  confirmationId,
}: ShippingReceiptDialogProps) => {
  if (!data) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
              <span className="font-medium text-gray-900">{data.name}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Phone:</span>
              <span className="font-medium text-gray-900">{data.phoneNumber}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Package Weight:</span>
              <span className="font-medium text-gray-900">{data.weight} {data.unit}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Drop-off Date:</span>
              <span className="font-medium text-gray-900">{format(data.shippingDate, "MMM do, yyyy")}</span>
            </div>
            <div className="flex justify-between text-sm border-t border-gray-200 pt-2 mt-2">
              <span className="font-semibold text-gray-900">Total Cost:</span>
              <span className="font-bold text-site-blue">${calculateShippingCost(data)}</span>
            </div>
          </div>

          <div className="text-center text-xs text-gray-500 mt-4 pt-4 border-t border-gray-200">
            <p>Thank you for choosing ADOT International Market</p>
            <p>For any questions, please contact us with your confirmation ID</p>
          </div>
        </div>
        <DialogFooter>
          <Button 
            onClick={() => onOpenChange(false)}
            className="w-full bg-site-blue hover:bg-site-blue/90 text-white"
          >
            Done
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ShippingReceiptDialog;