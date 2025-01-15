import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/forms/FormField";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import SignaturePad from "./SignaturePad";
import { MoneyTransferData } from "../MoneyTransferPortal";

interface MoneyTransferFormProps {
  onSubmit: (data: MoneyTransferData) => Promise<void>;
  isSubmitting: boolean;
}

const MoneyTransferForm = ({ onSubmit, isSubmitting }: MoneyTransferFormProps) => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<MoneyTransferData>();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue('paymentProof', file);
    }
  };

  const handleSignatureChange = (signature: string) => {
    setValue('digitalSignature', signature);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Sender Information</h3>
        <FormField
          label="Full Name"
          id="senderName"
          registration={register("senderName", { required: "Sender name is required" })}
          error={errors.senderName?.message}
        />
        <FormField
          label="Phone Number"
          id="senderPhone"
          registration={register("senderPhone", { required: "Sender phone is required" })}
          error={errors.senderPhone?.message}
        />
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Recipient Information</h3>
        <FormField
          label="Full Name"
          id="recipientName"
          registration={register("recipientName", { required: "Recipient name is required" })}
          error={errors.recipientName?.message}
        />
        <FormField
          label="Phone Number"
          id="recipientPhone"
          registration={register("recipientPhone", { required: "Recipient phone is required" })}
          error={errors.recipientPhone?.message}
        />
        <FormField
          label="Bank Name"
          id="recipientBankName"
          registration={register("recipientBankName", { required: "Bank name is required" })}
          error={errors.recipientBankName?.message}
        />
        <FormField
          label="Bank Account Number"
          id="recipientBankNumber"
          registration={register("recipientBankNumber", { required: "Bank account number is required" })}
          error={errors.recipientBankNumber?.message}
        />
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Transfer Details</h3>
        <FormField
          label="Amount (USD)"
          id="amountUSD"
          type="number"
          registration={register("amountUSD", { 
            required: "Amount is required",
            min: { value: 1, message: "Amount must be greater than 0" }
          })}
          error={errors.amountUSD?.message}
        />

        <div className="space-y-2">
          <Label htmlFor="paymentProof">Payment Proof (Screenshot)</Label>
          <Input
            id="paymentProof"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="cursor-pointer"
          />
        </div>

        <div className="space-y-2">
          <Label>Digital Signature</Label>
          <SignaturePad onChange={handleSignatureChange} />
        </div>
      </div>

      <Button
        type="submit"
        className="w-full bg-site-blue hover:bg-site-blue/90"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Submitting..." : "Submit Transfer"}
      </Button>
    </form>
  );
};

export default MoneyTransferForm;