import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { TransferFormFields } from "./TransferFormFields";
import { TransferFormSignature } from "./TransferFormSignature";
import { TransferFormData } from "./types";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

interface MoneyTransferFormProps {
  isOpen: boolean;
  onClose: () => void;
  currentRate: number;
}

const formSchema = z.object({
  sender_name: z.string().min(1, "Sender's name is required"),
  sender_phone: z.string().min(1, "Sender's phone is required"),
  recipient_name: z.string().min(1, "Recipient's name is required"),
  recipient_phone: z.string().min(1, "Recipient's phone is required"),
  recipient_bank_name: z.string().min(1, "Bank name is required"),
  recipient_bank_number: z.string().min(1, "Account number is required"),
  amount_usd: z.number().min(1, "Amount must be greater than 0"),
});

export const MoneyTransferForm = ({ isOpen, onClose, currentRate }: MoneyTransferFormProps) => {
  const { toast } = useToast();
  const [showVerification, setShowVerification] = useState(false);
  const [signature, setSignature] = useState<any>(null);
  const [paymentProof, setPaymentProof] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [amountUSD, setAmountUSD] = useState(0);

  const form = useForm<TransferFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      sender_name: "",
      sender_phone: "",
      recipient_name: "",
      recipient_phone: "",
      recipient_bank_name: "",
      recipient_bank_number: "",
      amount_usd: 0,
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPaymentProof(e.target.files[0]);
    }
  };

  const handleContinue = async () => {
    const isValid = await form.trigger();
    if (isValid) {
      setShowVerification(true);
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
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader className="p-6 bg-gray-50/50 border-b">
          <DialogTitle className="text-xl font-semibold text-gray-900">
            Send Money to Ethiopia
          </DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="p-6 space-y-6">
            {!showVerification ? (
              <>
                <TransferFormFields
                  amountUSD={amountUSD}
                  currentRate={currentRate}
                  setAmountUSD={setAmountUSD}
                />

                <div className="flex justify-end pt-4 border-t">
                  <Button 
                    type="button" 
                    onClick={handleContinue}
                    className="bg-site-blue hover:bg-blue-600"
                  >
                    Continue to Verification
                  </Button>
                </div>
              </>
            ) : (
              <div className="space-y-6">
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
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setShowVerification(false)}
                  >
                    Back
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="bg-site-blue hover:bg-blue-600"
                  >
                    {isSubmitting ? "Submitting..." : "Submit Transfer"}
                  </Button>
                </div>
              </div>
            )}
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};