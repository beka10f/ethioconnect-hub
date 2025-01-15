import { Input } from "@/components/ui/input";
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
} from "@/components/ui/form";

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
  exchangeRate: number;
  setAmountUSD: (amount: number) => void;
}

export const TransferFormFields = ({
  amountUSD,
  exchangeRate,
  setAmountUSD,
}: TransferFormFieldsProps) => {
  const { register, formState: { errors }, control } = useFormContext<TransferFormData>();

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || 0;
    setAmountUSD(value);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={control}
          name="sender_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base font-medium">Sender's Name</FormLabel>
              <FormControl>
                <Input className="h-12 text-base bg-white" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="sender_email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base font-medium">Sender's Email</FormLabel>
              <FormControl>
                <Input type="email" className="h-12 text-base bg-white" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={control}
          name="recipient_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base font-medium">Recipient's Name</FormLabel>
              <FormControl>
                <Input className="h-12 text-base bg-white" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="recipient_phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base font-medium">Recipient's Phone</FormLabel>
              <FormControl>
                <Input className="h-12 text-base bg-white" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={control}
        name="recipient_bank_name"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-base font-medium">Recipient's Bank</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger className="h-12 text-base bg-white">
                  <SelectValue placeholder="Select a bank" />
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
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="recipient_bank_account"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-base font-medium">Bank Account Number</FormLabel>
            <FormControl>
              <Input className="h-12 text-base bg-white" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={control}
          name="amount_usd"
          render={() => (
            <FormItem>
              <FormLabel className="text-base font-medium">Amount (USD)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  className="h-12 text-base bg-white"
                  value={amountUSD}
                  onChange={handleAmountChange}
                  min="0"
                  step="0.01"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="amount_etb"
          render={() => (
            <FormItem>
              <FormLabel className="text-base font-medium">Amount (ETB)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  className="h-12 text-base bg-white"
                  value={(amountUSD * exchangeRate).toFixed(2)}
                  readOnly
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};