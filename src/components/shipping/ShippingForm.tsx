import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { WeightInput } from "./WeightInput";
import { CustomerInfoFields } from "./CustomerInfoFields";
import { DateSelector } from "./DateSelector";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormField, FormItem, FormControl } from "@/components/ui/form";

export interface ShippingFormData {
  name: string;
  phoneNumber: string;
  weight: string;
  unit: "kg" | "lbs";
  shippingDate: Date;
  receiverName: string;
  receiverPhone: string;
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
      receiverName: "",
      receiverPhone: "",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <div className="bg-blue-50/50 p-4 rounded-lg space-y-4">
            <h3 className="font-medium text-gray-900">Sender Information</h3>
            <CustomerInfoFields form={form} />
          </div>
          
          <div className="bg-blue-50/50 p-4 rounded-lg space-y-4">
            <h3 className="font-medium text-gray-900">Receiver Information</h3>
            <FormField
              control={form.control}
              name="receiverName"
              render={({ field }) => (
                <FormItem>
                  <Label className="text-left block text-gray-900">
                    Receiver Name
                  </Label>
                  <FormControl>
                    <Input placeholder="Enter receiver's full name" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="receiverPhone"
              render={({ field }) => (
                <FormItem>
                  <Label className="text-left block text-gray-900">
                    Receiver Phone
                  </Label>
                  <FormControl>
                    <Input placeholder="Enter receiver's phone number" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </div>

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