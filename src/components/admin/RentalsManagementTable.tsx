import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useRentalApproval } from "@/hooks/useRentalApproval";
import { Button } from "@/components/ui/button";
import { DollarSign, MapPin, Calendar } from "lucide-react";

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

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
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
            <TableRow key={rental.id} className="hover:bg-blue-50/50">
              <TableCell className="font-medium text-gray-900">{rental.title}</TableCell>
              <TableCell>
                <div className="flex items-center gap-1.5 text-gray-700">
                  <MapPin className="w-4 h-4 text-blue-600" />
                  {rental.address}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1 text-gray-700">
                  <DollarSign className="w-4 h-4 text-blue-600" />
                  {rental.price}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1.5 text-gray-600">
                  <Calendar className="w-4 h-4" />
                  {new Date(rental.created_at).toLocaleDateString()}
                </div>
              </TableCell>
              {status === 'pending' && (
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white"
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
  );
};

export default RentalsManagementTable;