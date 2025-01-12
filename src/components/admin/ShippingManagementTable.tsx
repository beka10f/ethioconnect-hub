import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Package, Calendar, DollarSign } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

type ShippingDetails = {
  id: string;
  customer_name: string;
  phone: string;
  weight: number;
  weight_unit: string;
  cost: number;
  shipping_date: string;
  status: "pending" | "in_progress" | "completed" | "cancelled";
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
  if (isLoading) {
    return <div className="text-center py-4">Loading shipping requests...</div>;
  }

  if (!shippingRequests?.length) {
    return (
      <div className="text-center py-4 text-gray-500">
        No shipping requests found
      </div>
    );
  }

  const MobileShippingCard = ({ request }: { request: ShippingDetails }) => (
    <Card className="mb-4 last:mb-0">
      <CardContent className="p-4 space-y-4">
        <div>
          <h3 className="font-medium text-gray-900">{request.customer_name}</h3>
          <p className="text-sm text-gray-500">{request.phone}</p>
        </div>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Package className="h-4 w-4 text-gray-500" />
            <span>
              {request.weight} {request.weight_unit}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gray-500" />
            <span>{format(new Date(request.shipping_date), "MMM d, yyyy")}</span>
          </div>
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-gray-500" />
            <span>${request.cost}</span>
          </div>
        </div>
        <Badge
          variant="secondary"
          className={`${statusColors[request.status]} border-none w-full justify-center`}
        >
          {request.status.replace("_", " ")}
        </Badge>
      </CardContent>
    </Card>
  );

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
      <ScrollArea className="h-[calc(100vh-20rem)]">
        <div className="md:hidden p-4">
          {shippingRequests.map((request) => (
            <MobileShippingCard key={request.id} request={request} />
          ))}
        </div>
        <div className="hidden md:block">
          <Table>
            <TableHeader className="bg-gray-50">
              <TableRow>
                <TableHead className="text-gray-900">Customer</TableHead>
                <TableHead className="text-gray-900">Package Details</TableHead>
                <TableHead className="text-gray-900">Shipping Date</TableHead>
                <TableHead className="text-gray-900">Status</TableHead>
                <TableHead className="text-gray-900">Cost</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {shippingRequests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell>
                    <div className="space-y-1">
                      <p className="font-medium">{request.customer_name}</p>
                      <p className="text-sm text-gray-500">{request.phone}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Package className="h-4 w-4 text-gray-500" />
                      <span>
                        {request.weight} {request.weight_unit}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span>{format(new Date(request.shipping_date), "MMM d, yyyy")}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className={`${statusColors[request.status]} border-none`}
                    >
                      {request.status.replace("_", " ")}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-gray-500" />
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
  );
};

export default ShippingManagementTable;