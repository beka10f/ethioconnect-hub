import { useFormContext } from "react-hook-form";
import { TransferFormData } from "./types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { TransferFormSection } from "./TransferFormSection";
import { Bank, DollarSign, Phone, User } from "lucide-react";

const ETHIOPIAN_BANKS = [
  "Commercial Bank of Ethiopia (CBE)",
  "Dashen Bank",
  "Awash Bank",
  "Abyssinia Bank",
  "United Bank (Hibret Bank)",
  "Nib International Bank",
  "Zemen Bank",
  "Berhan Bank",
  "Cooperative Bank of Oromia (CBO)",
  "Lion International Bank",
  "Bunna International Bank",
  "Wegagen Bank",
  "Abay Bank",
  "Enat Bank",
  "Debub Global Bank",
  "Oromia International Bank",
  "Addis International Bank",
  "Hijra Bank",
];

interface TransferFormFieldsProps {
  amountUSD: number;
  currentRate: number;
  setAmountUSD: (amount: number) => void;
}

export const TransferFormFields = ({
  amountUSD,
  currentRate,
  setAmountUSD,
}: TransferFormFieldsProps) => {
  const { control } = useFormContext<TransferFormData>();

  return (
    <div className="space-y-6">
      <TransferFormSection title="Person Sending Money" icon={<User />}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={control}
            name="sender_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-medium">Your Full Name</FormLabel>
                <FormControl>
                  <Input className="h-12 text-base bg-white" {...field} />
                </FormControl>
                <FormDescription>Enter your name as it appears on your ID</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="sender_phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-medium">Your Phone Number</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                    <Input className="h-12 text-base bg-white pl-10" {...field} />
                  </div>
                </FormControl>
                <FormDescription>Example: +1 (555) 123-4567</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </TransferFormSection>

      <TransferFormSection title="Person Receiving Money" icon={<User />}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={control}
            name="recipient_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-medium">Their Full Name</FormLabel>
                <FormControl>
                  <Input className="h-12 text-base bg-white" {...field} />
                </FormControl>
                <FormDescription>Enter their name exactly as it appears on their ID</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="recipient_phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-medium">Their Phone Number</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                    <Input className="h-12 text-base bg-white pl-10" {...field} />
                  </div>
                </FormControl>
                <FormDescription>Example: +251 91 234 5678</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </TransferFormSection>

      <TransferFormSection title="Bank Information" icon={<Bank />}>
        <FormField
          control={control}
          name="recipient_bank_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base font-medium">Choose Their Bank</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger className="h-12 text-base bg-white">
                    <SelectValue placeholder="Select their bank in Ethiopia" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <ScrollArea className="h-[200px]">
                    {ETHIOPIAN_BANKS.map((bank) => (
                      <SelectItem key={bank} value={bank}>
                        {bank}
                      </SelectItem>
                    ))}
                  </ScrollArea>
                </SelectContent>
              </Select>
              <FormDescription>Select the bank where they will receive the money</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="recipient_bank_number"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base font-medium">Their Bank Account Number</FormLabel>
              <FormControl>
                <Input className="h-12 text-base bg-white" {...field} />
              </FormControl>
              <FormDescription>Enter their bank account number carefully</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </TransferFormSection>

      <TransferFormSection title="Amount to Send" icon={<DollarSign />}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={control}
            name="amount_usd"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-medium">Amount in USD ($)</FormLabel>
                <FormControl>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                    <Input
                      type="number"
                      className="h-12 text-base bg-white pl-10"
                      {...field}
                      value={field.value || ''}
                      onChange={(e) => {
                        const value = e.target.value === '' ? 0 : parseFloat(e.target.value);
                        field.onChange(value);
                        setAmountUSD(value);
                      }}
                    />
                  </div>
                </FormControl>
                <FormDescription>Enter the amount in US Dollars</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormItem>
            <FormLabel className="text-base font-medium">Amount in ETB (Birr)</FormLabel>
            <FormControl>
              <Input
                type="number"
                className="h-12 text-base bg-gray-50 cursor-not-allowed"
                value={(amountUSD * currentRate).toFixed(2)}
                readOnly
                disabled
              />
            </FormControl>
            <FormDescription>This is how much they will receive in Ethiopian Birr</FormDescription>
          </FormItem>
        </div>
      </TransferFormSection>
    </div>
  );
};