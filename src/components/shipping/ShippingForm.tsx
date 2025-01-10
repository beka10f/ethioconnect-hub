import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { WeightInput } from "./WeightInput";
import { CustomerInfoFields } from "./CustomerInfoFields";
import { DateSelector } from "./DateSelector";

export interface ShippingFormData {
  name: string;
  phoneNumber: string;
  weight: string;
  unit: "kg" | "lbs";
  shippingDate: Date;
}

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

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <CustomerInfoFields form={form} />
        <WeightInput form={form} />
        <DateSelector form={form} />
        <Button 
          type="submit" 
          className="w-full bg-site-blue hover:bg-site-blue/90"
        >
          Calculate Shipping Cost
        </Button>
      </form>
    </Form>
  );
};

export default ShippingForm;