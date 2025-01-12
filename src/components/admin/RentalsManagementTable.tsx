import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useRentalApproval } from "@/hooks/useRentalApproval";
import { Button } from "@/components/ui/button";
import { DollarSign, MapPin, Calendar } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

type RentalListing = {
  id: string;
  title: string;
  address: string;
  price: number;
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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-32">
        <p className="text-gray-600">Loading rentals...</p>
      </div>
    );
  }

  if (rentals.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6 text-center border border-gray-200">
        <p className="text-gray-600">No {status} rentals found</p>
      </div>
    );
  }

  const MobileRentalCard = ({ rental }: { rental: RentalListing }) => (
    <Card className="mb-4 last:mb-0">
      <CardContent className="p-4 space-y-4">
        <div>
          <h3 className="font-medium text-gray-900">{rental.title}</h3>
          <div className="flex items-center gap-1.5 text-gray-700 mt-2">
            <MapPin className="w-4 h-4 text-site-blue" />
            {rental.address}
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex items-center gap-1 text-gray-700">
            <DollarSign className="w-4 h-4 text-site-blue" />
            {rental.price}
          </div>
          <div className="flex items-center gap-1.5 text-gray-600">
            <Calendar className="w-4 h-4 text-site-blue" />
            {new Date(rental.created_at).toLocaleDateString()}
          </div>
        </div>
        {status === 'pending' && (
          <div className="flex flex-col gap-2">
            <Button
              variant="outline"
              className="w-full border-site-blue text-site-blue hover:bg-site-blue hover:text-white"
              onClick={() => handleApproval(rental.id, "approve")}
              disabled={isUpdating}
            >
              Approve
            </Button>
            <Button
              variant="outline"
              className="w-full border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
              onClick={() => handleApproval(rental.id, "reject")}
              disabled={isUpdating}
            >
              Reject
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
      <ScrollArea className="h-[calc(100vh-20rem)]">
        <div className="md:hidden p-4">
          {rentals.map((rental) => (
            <MobileRentalCard key={rental.id} rental={rental} />
          ))}
        </div>
        <div className="hidden md:block">
          <Table>
            <TableHeader className="bg-gray-50">
              <TableRow>
                <TableHead className="text-gray-900">Title</TableHead>
                <TableHead className="text-gray-900">Location</TableHead>
                <TableHead className="text-gray-900">Price</TableHead>
                <TableHead className="text-gray-900">Date</TableHead>
                {status === 'pending' && <TableHead className="text-gray-900">Actions</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {rentals.map((rental) => (
                <TableRow key={rental.id} className="hover:bg-site-blue/5">
                  <TableCell className="font-medium text-gray-900">{rental.title}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5 text-gray-700">
                      <MapPin className="w-4 h-4 text-site-blue" />
                      {rental.address}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-gray-700">
                      <DollarSign className="w-4 h-4 text-site-blue" />
                      {rental.price}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5 text-gray-600">
                      <Calendar className="w-4 h-4 text-site-blue" />
                      {new Date(rental.created_at).toLocaleDateString()}
                    </div>
                  </TableCell>
                  {status === 'pending' && (
                    <TableCell>
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
  );
};

export default RentalsManagementTable;