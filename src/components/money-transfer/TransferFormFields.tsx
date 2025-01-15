import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useFormContext } from "react-hook-form";
import { TransferFormData } from "./types";

interface TransferFormFieldsProps {
  amountUSD: number;
  currentRate: number;
}

export const TransferFormFields = ({
  amountUSD,
  currentRate,
}: TransferFormFieldsProps) => {
  const form = useFormContext<TransferFormData>();
  const amountETB = amountUSD * currentRate;

  return (
    <div className="space-y-8 px-1">
      <div className="space-y-6">
        <h3 className="text-xl font-semibold text-gray-900">Sender Information</h3>
        <div className="grid grid-cols-1 gap-6">
          <FormField
            name="sender_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-medium">Sender's Name</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Enter sender's name" 
                    className="h-12 text-base" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            name="sender_phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-medium">Sender's Phone</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Enter sender's phone" 
                    className="h-12 text-base" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      <div className="space-y-6">
        <h3 className="text-xl font-semibold text-gray-900">Recipient Information</h3>
        <div className="grid grid-cols-1 gap-6">
          <FormField
            name="recipient_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-medium">Recipient's Name</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Enter recipient's name" 
                    className="h-12 text-base" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="recipient_phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-medium">Recipient's Phone</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Enter recipient's phone" 
                    className="h-12 text-base" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="recipient_bank_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-medium">Recipient's Bank</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Enter bank name" 
                    className="h-12 text-base" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="recipient_bank_number"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-medium">Bank Account Number</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Enter account number" 
                    className="h-12 text-base" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      <div className="space-y-6">
        <h3 className="text-xl font-semibold text-gray-900">Amount Information</h3>
        <div className="grid grid-cols-1 gap-6">
          <FormField
            name="amount_usd"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-medium">Amount (USD)</FormLabel>
                <FormControl>
                  <Input 
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="Enter amount in USD" 
                    className="h-12 text-base"
                    value={field.value || ''}
                    onChange={(e) => {
                      const value = e.target.value === '' ? 0 : parseFloat(e.target.value);
                      field.onChange(value);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="space-y-2">
            <label className="text-base font-medium text-gray-900">Amount (ETB)</label>
            <div className="h-12 px-4 rounded-md border border-gray-200 bg-gray-50/50 text-gray-500 flex items-center">
              {amountETB.toFixed(2)} ETB
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};