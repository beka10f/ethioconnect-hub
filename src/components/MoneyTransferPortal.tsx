import { useState } from "react";
import Portal from "./Portal";
import MoneyTransferForm from "./money-transfer/MoneyTransferForm";
import MoneyTransferReceipt from "./money-transfer/MoneyTransferReceipt";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export type MoneyTransferData = {
  senderName: string;
  senderPhone: string;
  recipientName: string;
  recipientPhone: string;
  recipientBankName: string;
  recipientBankNumber: string;
  amountUSD: number;
  paymentProof?: File;
  digitalSignature?: string;
};

const MoneyTransferPortal = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [transferId, setTransferId] = useState<string | null>(null);

  const handleTransferSubmit = async (data: MoneyTransferData) => {
    try {
      setIsSubmitting(true);

      // Upload payment proof if provided
      let paymentProofUrl = null;
      if (data.paymentProof) {
        const fileExt = data.paymentProof.name.split('.').pop();
        const filePath = `${crypto.randomUUID()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('payment_proofs')
          .upload(filePath, data.paymentProof);

        if (uploadError) throw uploadError;
        paymentProofUrl = filePath;
      }

      // Get current exchange rate
      const { data: rateData, error: rateError } = await supabase
        .from('exchange_rates')
        .select('rate')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (rateError) throw rateError;

      const exchangeRate = rateData.rate;
      const amountETB = data.amountUSD * exchangeRate;

      // Create transfer record
      const { data: transfer, error: transferError } = await supabase
        .from('money_transfers')
        .insert({
          sender_name: data.senderName,
          sender_phone: data.senderPhone,
          recipient_name: data.recipientName,
          recipient_phone: data.recipientPhone,
          recipient_bank_name: data.recipientBankName,
          recipient_bank_number: data.recipientBankNumber,
          amount_usd: data.amountUSD,
          amount_etb: amountETB,
          exchange_rate: exchangeRate,
          payment_proof_url: paymentProofUrl,
          digital_signature: data.digitalSignature,
        })
        .select()
        .single();

      if (transferError) throw transferError;

      setTransferId(transfer.id);
      toast.success("Transfer submitted successfully!");
    } catch (error) {
      console.error("Transfer submission error:", error);
      toast.error("Failed to submit transfer. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Portal title="Money Transfer">
      {transferId ? (
        <MoneyTransferReceipt 
          transferId={transferId} 
          onReset={() => setTransferId(null)} 
        />
      ) : (
        <MoneyTransferForm 
          onSubmit={handleTransferSubmit} 
          isSubmitting={isSubmitting} 
        />
      )}
    </Portal>
  );
};

export default MoneyTransferPortal;