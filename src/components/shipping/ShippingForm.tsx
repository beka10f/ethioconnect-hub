import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/forms/FormField";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { calculateShippingCost } from "@/utils/shipping";

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
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    getValues,
  } = useForm<ShippingFormData>({
    defaultValues: {
      unit: "kg",
      shippingDate: new Date(),
    },
  });

  const handleFormSubmit = (data: ShippingFormData) => {
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <FormField
        label="Full Name"
        id="name"
        placeholder="Enter your full name"
        registration={register("name", { required: "Full name is required" })}
        error={errors.name?.message}
        className="w-full"
      />

      <FormField
        label="Phone Number"
        id="phoneNumber"
        placeholder="Enter your phone number"
        registration={register("phoneNumber", {
          required: "Phone number is required",
        })}
        error={errors.phoneNumber?.message}
        className="w-full"
      />

      <div className="space-y-3">
        <Label className="text-left block text-sm font-medium text-gray-900">
          Package Weight
        </Label>
        <div className="flex gap-4">
          <div className="flex-1">
            <FormField
              id="weight"
              placeholder="Enter weight"
              registration={register("weight", {
                required: "Weight is required",
                pattern: {
                  value: /^\d*\.?\d*$/,
                  message: "Please enter a valid number",
                },
              })}
              error={errors.weight?.message}
              className="w-full"
            />
          </div>
          <div className="w-32">
            <RadioGroup
              defaultValue={getValues("unit")}
              onValueChange={(value) => setValue("unit", value as "kg" | "lbs")}
              className="flex gap-3"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="kg" id="kg" />
                <Label htmlFor="kg">KG</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="lbs" id="lbs" />
                <Label htmlFor="lbs">LBS</Label>
              </div>
            </RadioGroup>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <Label className="text-left block text-sm font-medium text-gray-900">
          Shipping Date
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
  );
};

export default ShippingForm;