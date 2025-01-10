import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormField, FormItem, FormControl } from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { ShippingFormData } from "./ShippingForm";

interface CustomerInfoFieldsProps {
  form: UseFormReturn<ShippingFormData>;
}

export const CustomerInfoFields = ({ form }: CustomerInfoFieldsProps) => {
  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <Label className="text-left block text-gray-900 font-medium">
              Full Name
            </Label>
            <FormControl>
              <Input placeholder="Enter your full name" {...field} />
            </FormControl>
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="phoneNumber"
        render={({ field }) => (
          <FormItem>
            <Label className="text-left block text-gray-900 font-medium">
              Phone Number
            </Label>
            <FormControl>
              <Input placeholder="Enter your phone number" {...field} />
            </FormControl>
          </FormItem>
        )}
      />
    </div>
  );
};