import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useRentalApproval } from "@/hooks/useRentalApproval";
import { Button } from "@/components/ui/button";
import { DollarSign, MapPin, Calendar, ChevronRight, CheckCircle, XCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";

type RentalListing = {
  id: string;
  title: string;
  address: string;
  price: number;
  description: string;
  contact_info: string;
  phone_number: string;
  status: string;
  created_at: string;
};

interface RentalsManagementTableProps {
  rentals: RentalListing[];
  onRentalUpdate: () => void;
  status: 'pending' | 'approved' | 'rejected';
  isLoading: boolean;
}

const RentalsManagementTable = ({ rentals, onRentalUpdate, status, isLoading }: RentalsManagementTableProps) => {
  const { handleApproval, isUpdating } = useRentalApproval(onRentalUpdate);
  const [selectedRental, setSelectedRental] = useState<RentalListing | null>(null);

  if (isLoading) {
    return (
      <div className="bg-white/70 backdrop-blur-sm rounded-lg shadow-sm overflow-hidden border border-gray-200/50 p-4">
        <p className="text-center text-gray-500">Loading rentals...</p>
      </div>
    );
  }

  if (rentals.length === 0) {
    return (
      <div className="bg-white/70 backdrop-blur-sm rounded-lg shadow-sm overflow-hidden border border-gray-200/50 p-8">
        <p className="text-center text-gray-500">No rentals found</p>
      </div>
    );
  }

  const getStatusColor = (rentalStatus: string) => {
    switch (rentalStatus) {
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
  };

  const MobileRentalCard = ({ rental }: { rental: RentalListing }) => (
    <Card 
      className="mb-3 last:mb-0 overflow-hidden border-0 shadow-sm"
      onClick={() => setSelectedRental(rental)}
    >
      <CardContent className="p-0">
        <div className="px-4 py-3 bg-white">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-gray-900 truncate">{rental.title}</h3>
              <p className="text-sm text-gray-500 mt-0.5 truncate">{rental.address}</p>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0 mt-1" />
          </div>
          
          <div className="mt-2 space-y-1.5">
            <div className="flex items-center text-sm text-gray-600">
              <DollarSign className="w-4 h-4 mr-1.5 text-site-blue" />
              <span>{rental.price}</span>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <Calendar className="w-4 h-4 mr-1.5 text-gray-400" />
              <span>{new Date(rental.created_at).toLocaleDateString()}</span>
            </div>
          </div>
          
          {status === 'pending' && (
            <div className="mt-3 flex gap-2">
              <Button
                variant="outline"
                className="flex-1 border-site-blue text-site-blue hover:bg-site-blue hover:text-white"
                onClick={(e) => {
                  e.stopPropagation();
                  handleApproval(rental.id, "approve");
                }}
                disabled={isUpdating}
              >
                <CheckCircle className="w-4 h-4 mr-1.5" />
                Approve
              </Button>
              <Button
                variant="outline"
                className="flex-1 border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                onClick={(e) => {
                  e.stopPropagation();
                  handleApproval(rental.id, "reject");
                }}
                disabled={isUpdating}
              >
                <XCircle className="w-4 h-4 mr-1.5" />
                Reject
              </Button>
            </div>
          )}

          {status !== 'pending' && (
            <div className="mt-3">
              <Badge 
                variant="secondary"
                className={`w-full justify-center ${getStatusColor(status)}`}
              >
                {status === 'approved' ? (
                  <div className="flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4" />
                    Approved
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5">
                    <XCircle className="w-4 h-4" />
                    Rejected
                  </div>
                )}
              </Badge>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <>
      <div className="bg-white/70 backdrop-blur-sm rounded-lg shadow-sm overflow-hidden border border-gray-200/50">
        <ScrollArea className="h-[calc(100vh-20rem)]">
          <div className="md:hidden p-4">
            {rentals.map((rental) => (
              <MobileRentalCard key={rental.id} rental={rental} />
            ))}
          </div>
          <div className="hidden md:block">
            <Table>
              <TableHeader className="bg-gray-50/50 backdrop-blur-sm sticky top-0 z-10">
                <TableRow>
                  <TableHead className="text-gray-900 font-medium">Title</TableHead>
                  <TableHead className="text-gray-900 font-medium">Location</TableHead>
                  <TableHead className="text-gray-900 font-medium">Price</TableHead>
                  <TableHead className="text-gray-900 font-medium">Date</TableHead>
                  {status === 'pending' && <TableHead className="text-gray-900 font-medium">Actions</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {rentals.map((rental) => (
                  <TableRow 
                    key={rental.id} 
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => setSelectedRental(rental)}
                  >
                    <TableCell className="font-medium">{rental.title}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-4 h-4 text-site-blue" />
                        {rental.address}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <DollarSign className="w-4 h-4 text-site-blue" />
                        {rental.price}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        {new Date(rental.created_at).toLocaleDateString()}
                      </div>
                    </TableCell>
                    {status === 'pending' && (
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            className="border-site-blue text-site-blue hover:bg-site-blue hover:text-white"
                            onClick={() => handleApproval(rental.id, "approve")}
                            disabled={isUpdating}
                          >
                            Approve
                          </Button>
                          <Button
                            variant="outline"
                            className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                            onClick={() => handleApproval(rental.id, "reject")}
                            disabled={isUpdating}
                          >
                            Reject
                          </Button>
                        </div>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </ScrollArea>
      </div>

      <Dialog open={!!selectedRental} onOpenChange={(open) => !open && setSelectedRental(null)}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{selectedRental?.title}</DialogTitle>
            <DialogDescription>
              Posted on {selectedRental?.created_at && new Date(selectedRental.created_at).toLocaleDateString()}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-gray-900 mb-1">Description</h4>
              <p className="text-gray-700">{selectedRental?.description}</p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-1">Location</h4>
              <p className="text-gray-700">{selectedRental?.address}</p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-1">Contact Information</h4>
              <p className="text-gray-700">Email: {selectedRental?.contact_info}</p>
              <p className="text-gray-700">Phone: {selectedRental?.phone_number}</p>
            </div>
            {status === 'pending' && selectedRental && (
              <div className="flex justify-end gap-2 pt-4 border-t">
                <Button
                  variant="outline"
                  className="border-site-blue text-site-blue hover:bg-site-blue hover:text-white"
                  onClick={() => {
                    handleApproval(selectedRental.id, "approve");
                    setSelectedRental(null);
                  }}
                  disabled={isUpdating}
                >
                  Approve
                </Button>
                <Button
                  variant="outline"
                  className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                  onClick={() => {
                    handleApproval(selectedRental.id, "reject");
                    setSelectedRental(null);
                  }}
                  disabled={isUpdating}
                >
                  Reject
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default RentalsManagementTable;