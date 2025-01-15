import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";

const MoneyTransfersManagement = () => {
  const { data: transfers, isLoading } = useQuery({
    queryKey: ["money-transfers"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("money_transfers")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return <div>Loading transfers...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Money Transfers</h2>
      </div>

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
            <TableHead>Created</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transfers?.map((transfer) => (
            <TableRow key={transfer.id}>
              <TableCell className="font-mono">{transfer.reference_number}</TableCell>
              <TableCell>
                <div>
                  <div>{transfer.sender_name}</div>
                  <div className="text-sm text-gray-500">{transfer.sender_phone}</div>
                </div>
              </TableCell>
              <TableCell>
                <div>
                  <div>{transfer.recipient_name}</div>
                  <div className="text-sm text-gray-500">{transfer.recipient_phone}</div>
                  <div className="text-sm text-gray-500">
                    {transfer.recipient_bank_name} - {transfer.recipient_bank_number}
                  </div>
                </div>
              </TableCell>
              <TableCell>${transfer.amount_usd}</TableCell>
              <TableCell>ETB {transfer.amount_etb}</TableCell>
              <TableCell>{transfer.exchange_rate}</TableCell>
              <TableCell>
                <Badge
                  variant={
                    transfer.status === "completed"
                      ? "success"
                      : transfer.status === "rejected"
                      ? "destructive"
                      : "default"
                  }
                >
                  {transfer.status}
                </Badge>
              </TableCell>
              <TableCell className="text-sm text-gray-500">
                {formatDistanceToNow(new Date(transfer.created_at), { addSuffix: true })}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default MoneyTransfersManagement;