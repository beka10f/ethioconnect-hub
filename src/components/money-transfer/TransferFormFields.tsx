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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <FormField
        label="Sender's Name"
        id="sender_name"
        placeholder="Enter sender's name"
        registration={register("sender_name", { required: "Sender's name is required" })}
        error={errors.sender_name?.message}
      />
      
      <FormField
        label="Sender's Phone"
        id="sender_phone"
        placeholder="Enter sender's phone"
        registration={register("sender_phone", { required: "Sender's phone is required" })}
        error={errors.sender_phone?.message}
      />

      <FormField
        label="Recipient's Name"
        id="recipient_name"
        placeholder="Enter recipient's name"
        registration={register("recipient_name", { required: "Recipient's name is required" })}
        error={errors.recipient_name?.message}
      />

      <FormField
        label="Recipient's Phone"
        id="recipient_phone"
        placeholder="Enter recipient's phone"
        registration={register("recipient_phone", { required: "Recipient's phone is required" })}
        error={errors.recipient_phone?.message}
      />

      <FormField
        label="Recipient's Bank"
        id="recipient_bank_name"
        placeholder="Enter bank name"
        registration={register("recipient_bank_name", { required: "Bank name is required" })}
        error={errors.recipient_bank_name?.message}
      />

      <FormField
        label="Bank Account Number"
        id="recipient_bank_number"
        placeholder="Enter account number"
        registration={register("recipient_bank_number", { required: "Account number is required" })}
        error={errors.recipient_bank_number?.message}
      />

      <FormField
        label="Amount (USD)"
        id="amount_usd"
        type="number"
        placeholder="Enter amount in USD"
        registration={register("amount_usd", { 
          required: "Amount is required",
          min: { value: 1, message: "Amount must be greater than 0" }
        })}
        error={errors.amount_usd?.message}
      />

      <div className="flex flex-col space-y-2">
        <label className="text-sm font-medium text-gray-900">Amount (ETB)</label>
        <div className="h-10 px-3 py-2 rounded-md border border-gray-200 bg-gray-50/50 text-gray-500">
          {amountETB.toFixed(2)} ETB
        </div>
      </div>
    </div>
  );
};