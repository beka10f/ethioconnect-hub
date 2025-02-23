import React, { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Package, Calendar, DollarSign, Scale, ChevronRight, Printer, QrCode } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { QRCodeSVG } from "qrcode.react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

type ShippingDetails = {
  id: string;
  customer_name: string;
  phone: string;
  receiver_name: string;
  receiver_phone: string;
  weight: number;
  weight_unit: string;
  cost: number;
  shipping_date: string;
  status: "pending" | "in_progress" | "completed" | "cancelled";
  notes: string | null;
  created_at: string;
};

interface ShippingManagementTableProps {
  shippingRequests: ShippingDetails[];
  isLoading: boolean;
}

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800",
  in_progress: "bg-blue-100 text-blue-800",
  completed: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

const ShippingManagementTable = ({ shippingRequests, isLoading }: ShippingManagementTableProps) => {
  const [selectedRequest, setSelectedRequest] = useState<ShippingDetails | null>(null);

  const handlePrint = () => {
    const printContent = document.getElementById('admin-receipt-content');
    if (printContent) {
      const printWindow = window.open('', '', 'width=600,height=800');
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Shipping Details</title>
              <style>
                body { font-family: Arial, sans-serif; padding: 20px; }
                .header { text-align: center; margin-bottom: 20px; }
                .section { margin: 15px 0; border-top: 1px solid #eee; padding-top: 15px; }
                .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
                .label { color: #666; }
                .value { font-weight: bold; }
                .qr-code { text-align: center; margin: 20px 0; }
              </style>
            </head>
            <body>
              ${printContent.innerHTML}
            </body>
          </html>
        `);
        printWindow.document.close();
        printWindow.focus();
        printWindow.print();
        printWindow.close();
      }
    }
  };

  // Generate QR code URL for shipping details
  const getQrUrl = (request: ShippingDetails) => {
    return `${window.location.origin}/shipping/${request.id}`;
  };

  const MobileShippingCard = ({ request }: { request: ShippingDetails }) => (
    <Card 
      className="mb-3 last:mb-0 overflow-hidden border-0 shadow-sm hover:bg-gray-50 transition-all cursor-pointer"
      onClick={() => setSelectedRequest(request)}
    >
      <CardContent className="p-0">
        <div className="px-4 py-3 bg-white">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-gray-900 truncate">{request.customer_name}</h3>
              <p className="text-sm text-gray-500 mt-0.5">{request.phone}</p>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0 mt-1" />
          </div>
          
          <div className="mt-2 space-y-1.5">
            <div className="flex items-center text-sm text-gray-600">
              <Scale className="w-4 h-4 mr-1.5 text-site-blue" />
              <span>
                {request.weight} {request.weight_unit}
              </span>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <DollarSign className="w-4 h-4 mr-1.5 text-site-blue" />
              <span>${request.cost}</span>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <Calendar className="w-4 h-4 mr-1.5 text-gray-400" />
              <span>{new Date(request.shipping_date).toLocaleDateString()}</span>
            </div>
          </div>
          
          <div className="mt-3">
            <Badge 
              variant="secondary"
              className={`w-full justify-center ${statusColors[request.status]}`}
            >
              {request.status.replace("_", " ")}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (isLoading) {
    return (
      <div className="bg-white/70 backdrop-blur-sm rounded-lg shadow-sm overflow-hidden border border-gray-200/50 p-4">
        <p className="text-center text-gray-500">Loading shipping requests...</p>
      </div>
    );
  }

  if (!shippingRequests?.length) {
    return (
      <div className="bg-white/70 backdrop-blur-sm rounded-lg shadow-sm overflow-hidden border border-gray-200/50 p-8">
        <p className="text-center text-gray-500">No shipping requests found</p>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white/70 backdrop-blur-sm rounded-lg shadow-sm overflow-hidden border border-gray-200/50">
        <ScrollArea className="h-[calc(100vh-20rem)]">
          <div className="md:hidden p-4">
            {shippingRequests.map((request) => (
              <MobileShippingCard key={request.id} request={request} />
            ))}
          </div>
          <div className="hidden md:block">
            <Table>
              <TableHeader className="bg-gray-50/50 backdrop-blur-sm sticky top-0 z-10">
                <TableRow>
                  <TableHead className="text-gray-900 font-medium">Sender</TableHead>
                  <TableHead className="text-gray-900 font-medium">Receiver</TableHead>
                  <TableHead className="text-gray-900 font-medium">Package Details</TableHead>
                  <TableHead className="text-gray-900 font-medium">Shipping Date</TableHead>
                  <TableHead className="text-gray-900 font-medium">Status</TableHead>
                  <TableHead className="text-gray-900 font-medium">Cost</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {shippingRequests.map((request) => (
                  <TableRow 
                    key={request.id}
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => setSelectedRequest(request)}
                  >
                    <TableCell>
                      <div className="space-y-1">
                        <p className="font-medium">{request.customer_name}</p>
                        <p className="text-sm text-gray-500">{request.phone}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <p className="font-medium">{request.receiver_name}</p>
                        <p className="text-sm text-gray-500">{request.receiver_phone}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Package className="h-4 w-4 text-site-blue" />
                        <span>
                          {request.weight} {request.weight_unit}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <span>{new Date(request.shipping_date).toLocaleDateString()}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className={statusColors[request.status]}
                      >
                        {request.status.replace("_", " ")}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-site-blue" />
                        <span>${request.cost}</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </ScrollArea>
      </div>

      <Dialog open={!!selectedRequest} onOpenChange={(open) => !open && setSelectedRequest(null)}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Shipping Request Details</DialogTitle>
            <DialogDescription>
              Created on {selectedRequest?.created_at && new Date(selectedRequest.created_at).toLocaleDateString()}
            </DialogDescription>
          </DialogHeader>
          <div id="admin-receipt-content" className="space-y-4">
            <div>
              <h4 className="font-medium text-gray-900 mb-1">Sender Information</h4>
              <p className="text-gray-700">Name: {selectedRequest?.customer_name}</p>
              <p className="text-gray-700">Phone: {selectedRequest?.phone}</p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-1">Receiver Information</h4>
              <p className="text-gray-700">Name: {selectedRequest?.receiver_name}</p>
              <p className="text-gray-700">Phone: {selectedRequest?.receiver_phone}</p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-1">Package Details</h4>
              <p className="text-gray-700">
                Weight: {selectedRequest?.weight} {selectedRequest?.weight_unit}
              </p>
              <p className="text-gray-700">Cost: ${selectedRequest?.cost}</p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-1">Shipping Information</h4>
              <p className="text-gray-700">
                Date: {selectedRequest?.shipping_date && new Date(selectedRequest.shipping_date).toLocaleDateString()}
              </p>
              <p className="text-gray-700">Status: {selectedRequest?.status.replace("_", " ")}</p>
            </div>
            {selectedRequest?.notes && (
              <div>
                <h4 className="font-medium text-gray-900 mb-1">Notes</h4>
                <p className="text-gray-700">{selectedRequest.notes}</p>
              </div>
            )}
            <div className="flex flex-col items-center gap-2 border-t border-gray-200 pt-4">
              <QrCode className="w-5 h-5 text-gray-400" />
              <div className="bg-white p-2 rounded-lg shadow-sm border">
                {selectedRequest && (
                  <QRCodeSVG
                    value={getQrUrl(selectedRequest)}
                    size={200}
                    level="H"
                    includeMargin
                  />
                )}
              </div>
              <p className="text-xs text-gray-500 text-center">
                Scan to view shipping details online
              </p>
            </div>
          </div>
          <DialogFooter className="flex flex-col sm:flex-row gap-2 mt-4">
            <Button 
              onClick={handlePrint}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-900 gap-2"
            >
              <Printer className="w-4 h-4" />
              Print Details
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ShippingManagementTable;
