import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { TransferFormData } from "./types";

interface TransferFormFieldsProps {
  amountUSD: number;
  currentRate: number;
}

export const TransferFormFields = ({
  amountUSD,
  currentRate,
}: TransferFormFieldsProps) => {
  const amountETB = amountUSD * currentRate;

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-gray-900">Sender Information</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            name="sender_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sender's Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter sender's name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            name="sender_phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sender's Phone</FormLabel>
                <FormControl>
                  <Input placeholder="Enter sender's phone" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-medium text-gray-900">Recipient Information</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            name="recipient_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Recipient's Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter recipient's name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="recipient_phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Recipient's Phone</FormLabel>
                <FormControl>
                  <Input placeholder="Enter recipient's phone" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="recipient_bank_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Recipient's Bank</FormLabel>
                <FormControl>
                  <Input placeholder="Enter bank name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="recipient_bank_number"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bank Account Number</FormLabel>
                <FormControl>
                  <Input placeholder="Enter account number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-medium text-gray-900">Amount Information</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            name="amount_usd"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Amount (USD)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    placeholder="Enter amount in USD" 
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex flex-col space-y-2">
            <label className="text-sm font-medium text-gray-900">Amount (ETB)</label>
            <div className="h-10 px-3 py-2 rounded-md border border-gray-200 bg-gray-50/50 text-gray-500">
              {amountETB.toFixed(2)} ETB
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};