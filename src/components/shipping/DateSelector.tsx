import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { FormField, FormItem, FormControl } from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { ShippingFormData } from "./ShippingForm";

interface DateSelectorProps {
  form: UseFormReturn<ShippingFormData>;
}

export const DateSelector = ({ form }: DateSelectorProps) => {
  return (
    <FormField
      control={form.control}
      name="shippingDate"
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <Label className="text-left block text-gray-900 font-medium">
            Shipping Date
          </Label>
          <FormControl>
            <Calendar
              mode="single"
              selected={field.value}
              onSelect={field.onChange}
              className="rounded-md border"
              disabled={(date) => date < new Date()}
            />
          </FormControl>
        </FormItem>
      )}
    />
  );
};