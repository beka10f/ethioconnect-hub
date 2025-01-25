import React from "react";
import { format } from "date-fns";
import { Receipt, MapPin, QrCode, Printer } from "lucide-react";
import { ShippingFormData } from "./ShippingForm";
import { calculateShippingCost } from "@/utils/shipping";
import { QRCodeSVG } from "qrcode.react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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
  const handlePrint = () => {
    window.print();
  };

  if (!data) return null;

  // Simplified QR code data with essential shipping information
  const qrData = JSON.stringify({
    id: confirmationId,
    shipping: {
      sender: {
        name: data.name,
        phone: data.phoneNumber,
      },
      receiver: {
        name: data.receiverName,
        phone: data.receiverPhone,
      },
      package: {
        weight: `${data.weight} ${data.unit}`,
        date: format(data.shippingDate, "MMM do, yyyy"),
        cost: `$${calculateShippingCost(data)}`
      }
    }
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-[400px] p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg sm:text-xl font-semibold text-site-blue">
            <Receipt className="w-5 h-5" />
            Shipping Receipt
          </DialogTitle>
        </DialogHeader>
        
        <div id="receipt-content" className="space-y-4 bg-white rounded-lg">
          <div className="text-center border-b border-gray-100 pb-4">
            <h3 className="font-bold text-lg text-gray-900">ADOT International Market</h3>
            <div className="flex items-center justify-center gap-1 text-site-blue mt-1">
              <MapPin className="w-4 h-4" />
              <p className="text-sm">3111 Chillum Road, Mount Rainer, MD</p>
            </div>
          </div>

          <div className="grid gap-4 text-sm">
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="font-medium text-gray-600">Confirmation ID:</p>
              <p className="font-bold text-gray-900">{confirmationId.slice(0, 8)}</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="font-medium text-gray-600">Sender</p>
                <p className="font-bold text-gray-900">{data.name}</p>
                <p className="text-gray-600 mt-1">{data.phoneNumber}</p>
              </div>

              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="font-medium text-gray-600">Receiver</p>
                <p className="font-bold text-gray-900">{data.receiverName}</p>
                <p className="text-gray-600 mt-1">{data.receiverPhone}</p>
              </div>
            </div>

            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="font-medium text-gray-600">Package Details</p>
              <div className="grid grid-cols-2 gap-2 mt-1">
                <div>
                  <p className="text-gray-600">Weight:</p>
                  <p className="font-bold text-gray-900">{data.weight} {data.unit}</p>
                </div>
                <div>
                  <p className="text-gray-600">Drop-off:</p>
                  <p className="font-bold text-gray-900">{format(data.shippingDate, "MMM do, yyyy")}</p>
                </div>
              </div>
              <div className="mt-2 pt-2 border-t border-gray-200">
                <p className="text-gray-600">Total Cost:</p>
                <p className="font-bold text-site-blue text-lg">${calculateShippingCost(data)}</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center gap-2 pt-4">
            <QrCode className="w-5 h-5 text-gray-400" />
            <div className="bg-white p-2 rounded-lg shadow-sm border">
              <QRCodeSVG
                value={qrData}
                size={180}
                level="H"
                includeMargin
              />
            </div>
          </div>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-2 mt-4">
          <Button 
            onClick={handlePrint}
            className="w-full bg-site-blue hover:bg-site-blue/90 text-white gap-2"
          >
            <Printer className="w-4 h-4" />
            Print Receipt
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ShippingReceiptDialog;