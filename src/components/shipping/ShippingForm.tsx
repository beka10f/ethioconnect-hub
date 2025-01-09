import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { calculateShippingCost } from "@/utils/shipping";
import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import ShippingSummaryDialog from "./ShippingSummaryDialog";

const formSchema = z.object({
  customerName: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  weight: z.string().min(1, "Weight is required"),
  unit: z.enum(["kg", "lbs"]),
  shippingDate: z.date({
    required_error: "Please select a shipping date",
  }),
  notes: z.string().optional(),
});

export type ShippingFormData = z.infer<typeof formSchema>;

interface ShippingFormProps {
  onSubmit: (data: ShippingFormData & { cost: number }) => void;
}

const ShippingForm = ({ onSubmit }: ShippingFormProps) => {
  const [showSummary, setShowSummary] = useState(false);
  const [formData, setFormData] = useState<(ShippingFormData & { cost: number }) | null>(null);

  const form = useForm<ShippingFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      customerName: "",
      phone: "",
      weight: "",
      unit: "kg",
      notes: "",
    },
  });

  const handleSubmit = (values: ShippingFormData) => {
    const cost = calculateShippingCost(values);
    const data = { ...values, cost };
    setFormData(data);
    setShowSummary(true);
  };

  const handleConfirm = () => {
    if (formData) {
      onSubmit(formData);
      setShowSummary(false);
      form.reset();
    }
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="customerName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-left w-full">Customer Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter customer name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-left w-full">Phone Number</FormLabel>
                <FormControl>
                  <Input placeholder="Enter phone number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="weight"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-left w-full">Weight</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter weight" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="unit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-left w-full">Unit</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select unit" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="kg">Kilograms (kg)</SelectItem>
                      <SelectItem value="lbs">Pounds (lbs)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="shippingDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel className="text-left w-full">Shipping Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date < new Date() || date < new Date("1900-01-01")
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-left w-full">Notes (Optional)</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Add any special instructions or notes"
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full">Calculate Shipping</Button>
        </form>
      </Form>

      {showSummary && formData && (
        <ShippingSummaryDialog
          data={formData}
          open={showSummary}
          onClose={() => setShowSummary(false)}
          onConfirm={handleConfirm}
        />
      )}
    </>
  );
};

export default ShippingForm;