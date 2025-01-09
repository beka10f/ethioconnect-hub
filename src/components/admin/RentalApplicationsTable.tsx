import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Calendar, Mail, Phone } from "lucide-react";

type RentalApplication = {
  id: string;
  rental_id: string;
  full_name: string;
  email: string;
  phone: string;
  message: string | null;
  status: string;
  created_at: string;
  rental: {
    title: string;
    address: string;
  };
};

interface RentalApplicationsTableProps {
  applications: RentalApplication[];
  isLoading: boolean;
}

const RentalApplicationsTable = ({ applications, isLoading }: RentalApplicationsTableProps) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-32">
        <p className="text-gray-600">Loading applications...</p>
      </div>
    );
  }

  if (applications.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6 text-center border border-gray-200">
        <p className="text-gray-600">No rental applications found</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
      <Table>
        <TableHeader className="bg-gray-50">
          <TableRow>
            <TableHead className="text-gray-900">Applicant</TableHead>
            <TableHead className="text-gray-900">Property</TableHead>
            <TableHead className="text-gray-900">Contact</TableHead>
            <TableHead className="text-gray-900">Status</TableHead>
            <TableHead className="text-gray-900">Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {applications.map((application) => (
            <TableRow key={application.id} className="hover:bg-gray-50">
              <TableCell className="font-medium">{application.full_name}</TableCell>
              <TableCell>
                <div className="space-y-1">
                  <div className="font-medium text-gray-900">{application.rental.title}</div>
                  <div className="text-sm text-gray-500">{application.rental.address}</div>
                </div>
              </TableCell>
              <TableCell>
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5">
                    <Mail className="w-4 h-4 text-gray-500" />
                    <span className="text-sm">{application.email}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Phone className="w-4 h-4 text-gray-500" />
                    <span className="text-sm">{application.phone}</span>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant={application.status === 'pending' ? 'outline' : 'default'}>
                  {application.status}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1.5 text-gray-500">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm">
                    {new Date(application.created_at).toLocaleDateString()}
                  </span>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default RentalApplicationsTable;