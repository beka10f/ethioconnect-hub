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
      <DialogContent className="w-[95vw] max-w-[500px] p-0 bg-white rounded-2xl">
        <DialogHeader className="p-6 space-y-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Receipt className="w-6 h-6 text-site-blue" />
              <DialogTitle className="text-2xl font-semibold text-site-blue">
                Shipping Receipt
              </DialogTitle>
            </div>
          </div>
          <DialogDescription className="flex items-center justify-center gap-3 p-4 bg-blue-50 rounded-xl text-site-blue">
            <Camera className="w-8 h-8" strokeWidth={1.5} />
            <span className="text-lg font-medium">
              Please take a screenshot of this receipt for your records
            </span>
          </DialogDescription>
        </DialogHeader>

        <div className="p-8 space-y-6">
          <div className="text-center space-y-2">
            <h3 className="text-2xl font-bold text-gray-900">ADOT International Market</h3>
            <p className="text-lg text-gray-600">3111 Chillum Road, Mount Rainer, MD</p>
          </div>
          
          <div className="space-y-4 divide-y divide-gray-100">
            <div className="grid grid-cols-2 py-3 text-lg">
              <span className="text-gray-500">Confirmation ID:</span>
              <span className="font-medium text-right text-gray-900">{confirmationId.slice(0, 8)}</span>
            </div>
            <div className="grid grid-cols-2 py-3 text-lg">
              <span className="text-gray-500">Customer:</span>
              <span className="font-medium text-right text-gray-900">{data.name}</span>
            </div>
            <div className="grid grid-cols-2 py-3 text-lg">
              <span className="text-gray-500">Phone:</span>
              <span className="font-medium text-right text-gray-900">{data.phoneNumber}</span>
            </div>
            <div className="grid grid-cols-2 py-3 text-lg">
              <span className="text-gray-500">Package Weight:</span>
              <span className="font-medium text-right text-gray-900">{data.weight} {data.unit}</span>
            </div>
            <div className="grid grid-cols-2 py-3 text-lg">
              <span className="text-gray-500">Drop-off Date:</span>
              <span className="font-medium text-right text-gray-900">{format(data.shippingDate, "MMM do, yyyy")}</span>
            </div>
            <div className="grid grid-cols-2 py-4 text-xl">
              <span className="font-semibold text-gray-900">Total Cost:</span>
              <span className="font-bold text-right text-site-blue">${calculateShippingCost(data)}</span>
            </div>
          </div>

          <div className="text-center space-y-1 pt-6 border-t border-gray-100">
            <p className="text-gray-600">Thank you for choosing ADOT International Market</p>
            <p className="text-gray-500 text-sm">For any questions, please contact us with your confirmation ID</p>
          </div>
        </div>

        <DialogFooter className="p-6 border-t border-gray-100">
          <Button 
            onClick={() => onOpenChange(false)}
            className="w-full h-12 text-lg bg-site-blue hover:bg-site-blue/90 text-white rounded-xl"
          >
            Done
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ShippingReceiptDialog;