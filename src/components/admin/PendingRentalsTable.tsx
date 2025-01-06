import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useRentalApproval } from "@/hooks/useRentalApproval";

type RentalListing = {
  id: string;
  title: string;
  address: string;
  price: number;
  status: string;
  created_at: string;
};

interface PendingRentalsTableProps {
  pendingRentals: RentalListing[];
  onRentalUpdate: () => void;
}

const PendingRentalsTable = ({ pendingRentals, onRentalUpdate }: PendingRentalsTableProps) => {
  const { handleApproval, isUpdating } = useRentalApproval(onRentalUpdate);

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-ethiopian-sage/20">
      <Table>
        <TableHeader className="bg-ethiopian-coffee/5">
          <TableRow>
            <TableHead className="text-ethiopian-coffee">Title</TableHead>
            <TableHead className="text-ethiopian-coffee">Address</TableHead>
            <TableHead className="text-ethiopian-coffee">Price</TableHead>
            <TableHead className="text-ethiopian-coffee">Date</TableHead>
            <TableHead className="text-ethiopian-coffee">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pendingRentals.map((rental) => (
            <TableRow key={rental.id} className="hover:bg-ethiopian-cream/20">
              <TableCell className="font-medium text-ethiopian-coffee">{rental.title}</TableCell>
              <TableCell className="text-ethiopian-charcoal">{rental.address}</TableCell>
              <TableCell className="text-ethiopian-charcoal">${rental.price}</TableCell>
              <TableCell className="text-ethiopian-charcoal">
                {new Date(rental.created_at).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="border-ethiopian-sage text-ethiopian-sage hover:bg-ethiopian-sage hover:text-white"
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
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default PendingRentalsTable;