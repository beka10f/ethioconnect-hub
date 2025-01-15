import { FormField } from "@/components/forms/FormField";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { TransferFormData } from "./types";

interface TransferFormFieldsProps {
  register: UseFormRegister<TransferFormData>;
  errors: FieldErrors<TransferFormData>;
  amountUSD: number;
  currentRate: number;
}

export const TransferFormFields = ({
  register,
  errors,
  amountUSD,
  currentRate,
}: TransferFormFieldsProps) => {
  const amountETB = amountUSD * currentRate;

  return (
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
  );
};