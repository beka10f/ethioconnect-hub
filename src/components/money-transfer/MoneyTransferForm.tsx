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
import { CopyIcon, CheckIcon, AlertCircle } from "lucide-react";
import { TransferSteps } from "./TransferSteps";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface MoneyTransferFormProps {
  isOpen: boolean;
  onClose: () => void;
  currentRate: number;
}

const ZELLE_EMAIL = "myadotmarket@gmail.com";

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
  const [copied, setCopied] = useState(false);

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

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(ZELLE_EMAIL);
      setCopied(true);
      toast({
        title: "Email copied",
        description: "You can now paste it in your Zelle app",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        title: "Could not copy",
        description: "Please copy the email manually",
        variant: "destructive",
      });
    }
  };

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
          title: "Signature missing",
          description: "Please sign the form to continue",
          variant: "destructive",
        });
        return;
      }

      if (!paymentProof) {
        toast({
          title: "Payment proof missing",
          description: "Please upload your Zelle payment screenshot",
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
        title: "Transfer submitted",
        description: "We'll process your transfer and notify you once it's complete",
      });
      
      onClose();
    } catch (error: any) {
      toast({
        title: "Error submitting transfer",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] w-[95vw] max-h-[90vh] overflow-y-auto">
        <DialogHeader className="p-2.5 sm:p-3 bg-gray-50/50 border-b">
          <DialogTitle className="text-lg sm:text-xl font-semibold text-gray-900">
            Send Money to Ethiopia
          </DialogTitle>
        </DialogHeader>
        
        <div className="p-2.5 sm:p-3">
          <TransferSteps currentStep={showVerification ? 1 : 0} />
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {!showVerification ? (
                <>
                  <TransferFormFields
                    amountUSD={amountUSD}
                    currentRate={currentRate}
                    setAmountUSD={setAmountUSD}
                  />

                  <div className="flex justify-end pt-3 border-t">
                    <Button 
                      type="button" 
                      onClick={handleContinue}
                      className="w-full sm:w-auto bg-site-blue hover:bg-blue-600"
                      size="lg"
                    >
                      Continue to Payment
                    </Button>
                  </div>
                </>
              ) : (
                <div className="space-y-6">
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      Please complete the payment via Zelle and upload the screenshot below
                    </AlertDescription>
                  </Alert>

                  <div className="bg-blue-50 p-4 rounded-lg space-y-3">
                    <h3 className="font-medium text-blue-900">Payment Instructions</h3>
                    <div className="space-y-2">
                      <p className="text-sm text-blue-800">
                        1. Open your Zelle app
                      </p>
                      <p className="text-sm text-blue-800">
                        2. Send ${amountUSD.toFixed(2)} to:
                      </p>
                      <div className="flex items-center gap-2 bg-white p-2 rounded border border-blue-200">
                        <code className="flex-1 text-sm text-blue-700 break-all">
                          {ZELLE_EMAIL}
                        </code>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={handleCopyEmail}
                          className="h-8 px-2 shrink-0 text-blue-700 hover:text-blue-800 hover:bg-blue-100"
                        >
                          {copied ? (
                            <CheckIcon className="h-4 w-4" />
                          ) : (
                            <CopyIcon className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                      <p className="text-sm text-blue-800">
                        3. Take a screenshot of the payment confirmation
                      </p>
                      <p className="text-sm text-blue-800">
                        4. Upload the screenshot below and sign the form
                      </p>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-base font-medium text-gray-900">
                      Upload Payment Proof
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="w-full text-sm text-gray-500 file:mr-3 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-site-blue/10 file:text-site-blue hover:file:bg-site-blue/20"
                    />
                  </div>

                  <TransferFormSignature
                    signature={signature}
                    setSignature={setSignature}
                  />

                  <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 pt-3 border-t">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setShowVerification(false)}
                      className="w-full sm:w-auto order-2 sm:order-1"
                      size="lg"
                    >
                      Back
                    </Button>
                    <Button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="w-full sm:w-auto order-1 sm:order-2 bg-site-blue hover:bg-blue-600"
                      size="lg"
                    >
                      {isSubmitting ? "Submitting..." : "Complete Transfer"}
                    </Button>
                  </div>
                </div>
              )}
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};