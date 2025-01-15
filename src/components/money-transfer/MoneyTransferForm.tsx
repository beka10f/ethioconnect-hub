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

  const amountUSD = watch("amount_usd", 0);

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
          amount_etb: data.amount_usd * currentRate,
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
      <DialogContent className="sm:max-w-[600px] p-0">
        <DialogHeader className="p-6 bg-gray-50/50 border-b">
          <DialogTitle className="text-xl font-semibold text-gray-900">Send Money to Ethiopia</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-8">
          <TransferFormFields
            register={register}
            errors={errors}
            amountUSD={amountUSD}
            currentRate={currentRate}
          />

          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-900">Payment Proof</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-site-blue/10 file:text-site-blue hover:file:bg-site-blue/20"
            />
          </div>

          <TransferFormSignature
            signature={signature}
            setSignature={setSignature}
          />

          <div className="flex justify-end gap-4 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="bg-site-blue hover:bg-blue-600"
            >
              {isSubmitting ? "Submitting..." : "Submit Transfer"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};