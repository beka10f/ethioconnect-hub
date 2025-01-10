import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Form } from "@/components/ui/form";
import { FormField } from "@/components/forms/FormField";

export type ShippingFormData = {
  name: string;
  phoneNumber: string;
  weight: string;
  unit: "kg" | "lbs";
  shippingDate: Date;
};

interface ShippingFormProps {
  onSubmit: (data: ShippingFormData) => void;
}

const ShippingForm = ({ onSubmit }: ShippingFormProps) => {
  const form = useForm<ShippingFormData>({
    defaultValues: {
      name: "",
      phoneNumber: "",
      weight: "",
      unit: "kg",
      shippingDate: new Date(),
    },
  });

  const { register, handleSubmit, setValue, getValues, watch } = form;

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          label="Full Name"
          id="name"
          placeholder="Enter your full name"
          registration={register("name", { required: "Full name is required" })}
          error={form.formState.errors.name?.message}
          className="w-full"
        />

        <FormField
          label="Phone Number"
          id="phoneNumber"
          placeholder="Enter your phone number"
          registration={register("phoneNumber", {
            required: "Phone number is required",
          })}
          error={form.formState.errors.phoneNumber?.message}
          className="w-full"
        />

        <div className="space-y-3">
          <Label className="text-left block text-sm font-medium text-gray-900">
            Package Weight
          </Label>
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <FormField
                label=""
                id="weight"
                placeholder="Enter weight"
                registration={register("weight", {
                  required: "Weight is required",
                  pattern: {
                    value: /^\d*\.?\d*$/,
                    message: "Please enter a valid number",
                  },
                })}
                error={form.formState.errors.weight?.message}
                className="w-full h-[40px]"
              />
            </div>
            <div className="w-44">
              <RadioGroup
                defaultValue={getValues("unit")}
                onValueChange={(value) => setValue("unit", value as "kg" | "lbs")}
                className="flex h-[40px] p-1 bg-white border border-gray-200 rounded-full"
              >
                <div className="flex-1 relative">
                  <RadioGroupItem value="kg" id="kg" className="peer sr-only" />
                  <Label
                    htmlFor="kg"
                    className="flex h-full items-center justify-center px-4 rounded-full text-sm cursor-pointer transition-all peer-data-[state=checked]:bg-site-blue peer-data-[state=checked]:text-white"
                  >
                    KG
                  </Label>
                </div>
                <div className="flex-1 relative">
                  <RadioGroupItem value="lbs" id="lbs" className="peer sr-only" />
                  <Label
                    htmlFor="lbs"
                    className="flex h-full items-center justify-center px-4 rounded-full text-sm cursor-pointer transition-all peer-data-[state=checked]:bg-site-blue peer-data-[state=checked]:text-white"
                  >
                    LBS
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <Label className="text-left block text-sm font-medium text-gray-900">
            Drop-off Date
          </Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !watch("shippingDate") && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {watch("shippingDate") ? (
                  format(watch("shippingDate"), "PPP")
                ) : (
                  <span>Pick a date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={watch("shippingDate")}
                onSelect={(date) => setValue("shippingDate", date as Date)}
                disabled={(date) =>
                  date < new Date() || date < new Date("1900-01-01")
                }
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <Button
          type="submit"
          className="w-full bg-site-blue hover:bg-site-blue/90 text-white"
        >
          Calculate Shipping
        </Button>
      </form>
    </Form>
  );
};

export default ShippingForm;