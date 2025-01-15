import { useState } from "react";
import { useForm } from "react-hook-form";
import { FormField } from "@/components/forms/FormField";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import SignaturePad from "react-signature-canvas";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface MoneyTransferFormProps {
  isOpen: boolean;
  onClose: () => void;
  currentRate: number;
}

interface TransferFormData {
  senderName: string;
  senderPhone: string;
  recipientName: string;
  recipientPhone: string;
  recipientBankName: string;
  recipientBankNumber: string;
  amountUSD: number;
}

export const MoneyTransferForm = ({ isOpen, onClose, currentRate }: MoneyTransferFormProps) => {
  const { toast } = useToast();
  const [signature, setSignature] = useState<any>(null);
  const [paymentProof, setPaymentProof] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<TransferFormData>();

  const amountUSD = watch("amountUSD", 0);
  const amountETB = amountUSD * currentRate;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPaymentProof(e.target.files[0]);
    }
  };

  const onSubmit = async (data: TransferFormData) => {
    try {
      setIsSubmitting(true);

      if (!signature?.getTrimmedCanvas().toDataURL()) {
        toast({
          title: "Error",
          description: "Please provide your digital signature",
          variant: "destructive",
        });
        return;
      }

      if (!paymentProof) {
        toast({
          title: "Error",
          description: "Please upload payment proof",
          variant: "destructive",
        });
        return;
      }

      // Upload payment proof
      const fileExt = paymentProof.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from('payment_proofs')
        .upload(fileName, paymentProof);

      if (uploadError) throw uploadError;

      // Create transfer record
      const { error: transferError } = await supabase
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
          exchange_rate: currentRate,
          payment_proof_url: fileName,
          digital_signature: signature?.getTrimmedCanvas().toDataURL(),
        });

      if (transferError) throw transferError;

      toast({
        title: "Success",
        description: "Transfer request submitted successfully",
      });
      
      onClose();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Send Money to Ethiopia</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="Sender's Name"
              id="senderName"
              placeholder="Enter sender's name"
              registration={register("senderName", { required: "Sender's name is required" })}
              error={errors.senderName?.message}
            />
            
            <FormField
              label="Sender's Phone"
              id="senderPhone"
              placeholder="Enter sender's phone"
              registration={register("senderPhone", { required: "Sender's phone is required" })}
              error={errors.senderPhone?.message}
            />

            <FormField
              label="Recipient's Name"
              id="recipientName"
              placeholder="Enter recipient's name"
              registration={register("recipientName", { required: "Recipient's name is required" })}
              error={errors.recipientName?.message}
            />

            <FormField
              label="Recipient's Phone"
              id="recipientPhone"
              placeholder="Enter recipient's phone"
              registration={register("recipientPhone", { required: "Recipient's phone is required" })}
              error={errors.recipientPhone?.message}
            />

            <FormField
              label="Recipient's Bank"
              id="recipientBankName"
              placeholder="Enter bank name"
              registration={register("recipientBankName", { required: "Bank name is required" })}
              error={errors.recipientBankName?.message}
            />

            <FormField
              label="Bank Account Number"
              id="recipientBankNumber"
              placeholder="Enter account number"
              registration={register("recipientBankNumber", { required: "Account number is required" })}
              error={errors.recipientBankNumber?.message}
            />

            <FormField
              label="Amount (USD)"
              id="amountUSD"
              type="number"
              placeholder="Enter amount in USD"
              registration={register("amountUSD", { 
                required: "Amount is required",
                min: { value: 1, message: "Amount must be greater than 0" }
              })}
              error={errors.amountUSD?.message}
            />

            <div className="flex flex-col space-y-2">
              <label className="text-gray-900 font-medium">Amount (ETB)</label>
              <div className="h-10 px-3 py-2 border rounded-md bg-gray-50">
                {amountETB.toFixed(2)} ETB
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-gray-900 font-medium">Payment Proof</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-gray-900 font-medium">Digital Signature</label>
            <div className="border rounded-md bg-white">
              <SignaturePad
                ref={(ref) => setSignature(ref)}
                canvasProps={{
                  className: "w-full h-40",
                }}
              />
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => signature?.clear()}
            >
              Clear Signature
            </Button>
          </div>

          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit Transfer"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};