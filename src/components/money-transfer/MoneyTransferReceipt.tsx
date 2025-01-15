import { useEffect, useState } from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Receipt, ArrowRight } from "lucide-react";

interface MoneyTransferReceipt {
  transferId: string;
  onReset: () => void;
}

interface TransferDetails {
  reference_number: string;
  sender_name: string;
  recipient_name: string;
  recipient_bank_name: string;
  recipient_bank_number: string;
  amount_usd: number;
  amount_etb: number;
  exchange_rate: number;
  created_at: string;
}

const MoneyTransferReceipt = ({ transferId, onReset }: MoneyTransferReceipt) => {
  const [transfer, setTransfer] = useState<TransferDetails | null>(null);

  useEffect(() => {
    const fetchTransfer = async () => {
      const { data, error } = await supabase
        .from('money_transfers')
        .select('*')
        .eq('id', transferId)
        .single();

      if (error) {
        console.error('Error fetching transfer:', error);
        return;
      }

      setTransfer(data);
    };

    fetchTransfer();
  }, [transferId]);

  if (!transfer) {
    return <div>Loading receipt...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="bg-site-blue/5 p-6 rounded-xl border-2 border-site-blue/20">
        <div className="flex flex-col items-center gap-4">
          <Receipt className="w-8 h-8 text-site-blue animate-bounce" />
          <p className="text-site-blue font-semibold text-center text-lg">
            Please take a screenshot<br />of this receipt
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
        <div className="text-center border-b border-gray-200 pb-4">
          <h3 className="font-bold text-xl text-gray-900 mb-1">
            Money Transfer Receipt
          </h3>
          <p className="text-sm text-gray-500">
            Reference: {transfer.reference_number}
          </p>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-2 text-sm">
            <span className="text-gray-600">Date:</span>
            <span className="text-right font-medium">
              {format(new Date(transfer.created_at), "MMM d, yyyy h:mm a")}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-sm">
            <span className="text-gray-600">From:</span>
            <span className="text-right font-medium">{transfer.sender_name}</span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-sm">
            <span className="text-gray-600">To:</span>
            <span className="text-right font-medium">{transfer.recipient_name}</span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-sm">
            <span className="text-gray-600">Bank:</span>
            <span className="text-right font-medium">{transfer.recipient_bank_name}</span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-sm">
            <span className="text-gray-600">Account:</span>
            <span className="text-right font-medium">{transfer.recipient_bank_number}</span>
          </div>

          <div className="border-t border-gray-200 pt-4 mt-4">
            <div className="grid grid-cols-2 gap-2 text-sm">
              <span className="text-gray-600">Amount (USD):</span>
              <span className="text-right font-medium">
                ${transfer.amount_usd.toFixed(2)}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-sm">
              <span className="text-gray-600">Exchange Rate:</span>
              <span className="text-right font-medium">
                {transfer.exchange_rate.toFixed(2)} ETB
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-sm mt-2 pt-2 border-t border-gray-200">
              <span className="font-semibold text-gray-900">Amount (ETB):</span>
              <span className="text-right font-bold text-site-blue">
                {transfer.amount_etb.toFixed(2)} ETB
              </span>
            </div>
          </div>
        </div>

        <div className="text-center text-xs text-gray-500 border-t border-gray-200 pt-4">
          <p>Keep this receipt for your records.</p>
          <p>You will be notified when your transfer is processed.</p>
        </div>
      </div>

      <Button
        onClick={onReset}
        className="w-full bg-site-blue hover:bg-site-blue/90 gap-2"
      >
        New Transfer <ArrowRight className="w-4 h-4" />
      </Button>
    </div>
  );
};

export default MoneyTransferReceipt;