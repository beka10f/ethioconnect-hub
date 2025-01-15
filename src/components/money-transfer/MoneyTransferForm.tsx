import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { TransferFormFields } from "./TransferFormFields";
import { TransferFormSignature } from "./TransferFormSignature";
import { TransferFormData } from "./types";

interface MoneyTransferFormProps {
  isOpen: boolean;
  onClose: () => void;
  currentRate: number;
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

      const fileExt = paymentProof.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from('payment_proofs')
        .upload(fileName, paymentProof);

      if (uploadError) throw uploadError;

      const { error: transferError } = await supabase
        .from('money_transfers')
        .insert({
          ...data,
          amount_etb: data.amountUSD * currentRate,
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
          <TransferFormFields
            register={register}
            errors={errors}
            amountUSD={amountUSD}
            currentRate={currentRate}
          />

          <div className="space-y-2">
            <label className="block text-gray-900 font-medium">Payment Proof</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full"
            />
          </div>

          <TransferFormSignature
            signature={signature}
            setSignature={setSignature}
          />

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