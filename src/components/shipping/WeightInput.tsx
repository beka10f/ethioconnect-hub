import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { FormField, FormItem, FormControl } from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { ShippingFormData } from "./ShippingForm";

interface WeightInputProps {
  form: UseFormReturn<ShippingFormData>;
}

export const WeightInput = ({ form }: WeightInputProps) => {
  return (
    <div className="space-y-2">
      <Label className="text-left block text-gray-900 font-medium">
        Package Weight
      </Label>
      <div className="flex items-center gap-3">
        <FormField
          control={form.control}
          name="weight"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormControl>
                <Input
                  type="number"
                  placeholder="Enter weight"
                  className="h-10"
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="unit"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="h-10 bg-gray-100 rounded-full p-1 flex items-center"
                >
                  <div className="grid grid-cols-2 h-full gap-1">
                    {["kg", "lbs"].map((unit) => (
                      <div key={unit} className="relative h-full">
                        <RadioGroupItem
                          value={unit}
                          id={unit}
                          className="peer sr-only"
                        />
                        <Label
                          htmlFor={unit}
                          className="flex h-full w-16 cursor-pointer items-center justify-center rounded-full text-sm font-normal peer-data-[state=checked]:bg-site-blue peer-data-[state=checked]:text-white transition-colors"
                        >
                          {unit.toUpperCase()}
                        </Label>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              </FormControl>
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};