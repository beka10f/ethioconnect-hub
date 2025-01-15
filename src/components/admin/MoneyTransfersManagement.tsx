import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";

const fetchTransfers = async () => {
  const { data, error } = await supabase
    .from('money_transfers')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    throw error;
  }

  return data;
};

const MoneyTransfersManagement = () => {
  const { data: transfers, isLoading, error } = useQuery({
    queryKey: ['money-transfers'],
    queryFn: fetchTransfers,
  });

  if (isLoading) {
    return <div className="p-4">Loading transfers...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">Error loading transfers: {error.message}</div>;
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'rejected':
        return 'destructive';
      default:
        return 'default';
    }
  };

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Reference</TableHead>
              <TableHead>Sender</TableHead>
              <TableHead>Recipient</TableHead>
              <TableHead>Amount (USD)</TableHead>
              <TableHead>Amount (ETB)</TableHead>
              <TableHead>Rate</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transfers?.map((transfer) => (
              <TableRow key={transfer.id}>
                <TableCell className="font-medium">
                  {transfer.reference_number}
                </TableCell>
                <TableCell>
                  {transfer.sender_name}
                  <br />
                  <span className="text-sm text-gray-500">
                    {transfer.sender_phone}
                  </span>
                </TableCell>
                <TableCell>
                  {transfer.recipient_name}
                  <br />
                  <span className="text-sm text-gray-500">
                    {transfer.recipient_phone}
                  </span>
                </TableCell>
                <TableCell>${transfer.amount_usd}</TableCell>
                <TableCell>ETB {transfer.amount_etb}</TableCell>
                <TableCell>{transfer.exchange_rate}</TableCell>
                <TableCell>
                  <Badge variant={getStatusBadgeVariant(transfer.status)}>
                    {transfer.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  {format(new Date(transfer.created_at), 'MMM d, yyyy')}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default MoneyTransfersManagement;