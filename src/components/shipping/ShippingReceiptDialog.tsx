import React from "react";
import { format } from "date-fns";
import { Receipt, Camera, MapPin, QrCode } from "lucide-react";
import { ShippingFormData } from "./ShippingForm";
import { calculateShippingCost } from "@/utils/shipping";
import { QRCodeSVG } from "qrcode.react";
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
  const handleLocationClick = () => {
    window.open(
      "https://www.google.com/maps/search/?api=1&query=ADOT+International+Market+3111+Chillum+Road+Mount+Rainer+MD",
      "_blank"
    );
  };

  if (!data) return null;

  const qrData = JSON.stringify({
    id: confirmationId,
    sender: {
      name: data.name,
      phone: data.phoneNumber,
    },
    receiver: {
      name: data.receiverName,
      phone: data.receiverPhone,
    },
    package: {
      weight: data.weight,
      unit: data.unit,
      cost: calculateShippingCost(data),
      date: format(data.shippingDate, "yyyy-MM-dd"),
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-[400px] p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl font-semibold text-site-blue flex items-center gap-2">
            <Receipt className="w-5 h-5" />
            Shipping Receipt
          </DialogTitle>
          <DialogDescription className="bg-site-blue/5 p-6 rounded-lg mt-4 border-2 border-site-blue/20">
            <div className="flex flex-col items-center gap-4">
              <Camera className="w-8 h-8 text-site-blue animate-bounce" />
              <p className="text-site-blue font-semibold text-center text-base sm:text-lg">
                Please take a screenshot
                <br />
                of this receipt
              </p>
            </div>
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
          <div className="text-center border-b border-gray-200 pb-4">
            <div 
              onClick={handleLocationClick}
              className="cursor-pointer group hover:bg-gray-50 p-2 rounded-lg transition-colors"
            >
              <h3 className="font-bold text-lg text-gray-900 mb-1">ADOT International Market</h3>
              <div className="flex items-center justify-center gap-2 text-site-blue">
                <MapPin className="w-4 h-4" />
                <p className="text-sm group-hover:underline">
                  3111 Chillum Road, Mount Rainer, MD
                </p>
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="grid grid-cols-2 text-sm">
              <span className="text-gray-600">Confirmation ID:</span>
              <span className="font-medium text-gray-900 text-right">{confirmationId.slice(0, 8)}</span>
            </div>
            <div className="border-t border-gray-100 pt-2">
              <h4 className="font-medium text-gray-900 mb-2">Sender Details:</h4>
              <div className="grid grid-cols-2 text-sm gap-1">
                <span className="text-gray-600">Name:</span>
                <span className="font-medium text-gray-900 text-right">{data.name}</span>
                <span className="text-gray-600">Phone:</span>
                <span className="font-medium text-gray-900 text-right">{data.phoneNumber}</span>
              </div>
            </div>
            <div className="border-t border-gray-100 pt-2">
              <h4 className="font-medium text-gray-900 mb-2">Receiver Details:</h4>
              <div className="grid grid-cols-2 text-sm gap-1">
                <span className="text-gray-600">Name:</span>
                <span className="font-medium text-gray-900 text-right">{data.receiverName}</span>
                <span className="text-gray-600">Phone:</span>
                <span className="font-medium text-gray-900 text-right">{data.receiverPhone}</span>
              </div>
            </div>
            <div className="border-t border-gray-100 pt-2">
              <h4 className="font-medium text-gray-900 mb-2">Package Details:</h4>
              <div className="grid grid-cols-2 text-sm gap-1">
                <span className="text-gray-600">Weight:</span>
                <span className="font-medium text-gray-900 text-right">{data.weight} {data.unit}</span>
                <span className="text-gray-600">Drop-off Date:</span>
                <span className="font-medium text-gray-900 text-right">{format(data.shippingDate, "MMM do, yyyy")}</span>
                <span className="font-semibold text-gray-900">Total Cost:</span>
                <span className="font-bold text-site-blue text-right">${calculateShippingCost(data)}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center gap-2 border-t border-gray-200 pt-4">
            <QrCode className="w-5 h-5 text-gray-400" />
            <div className="bg-white p-2 rounded-lg shadow-sm border">
              <QRCodeSVG
                value={qrData}
                size={200}
                level="H"
                includeMargin
              />
            </div>
          </div>

          <div className="text-center text-xs text-gray-500 mt-4 pt-4 border-t border-gray-200">
            <p className="font-medium">Thank you for choosing ADOT International Market</p>
            <p className="mt-1">For any questions, please contact us with your confirmation ID</p>
          </div>
        </div>
        <DialogFooter>
          <Button 
            onClick={() => onOpenChange(false)}
            className="w-full bg-site-blue hover:bg-site-blue/90 text-white py-4"
          >
            Done
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ShippingReceiptDialog;