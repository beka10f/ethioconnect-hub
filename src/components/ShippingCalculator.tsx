import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phoneNumber: z.string().min(10, "Please enter a valid phone number"),
  weight: z.string().min(1, "Weight is required"),
  unit: z.enum(["kg", "lbs"]),
  shippingDate: z.date({
    required_error: "Please select a shipping date",
  }),
});

const ShippingCalculator = () => {
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      phoneNumber: "",
      weight: "",
      unit: "kg",
    },
  });

  const calculateShippingCost = (data: z.infer<typeof formSchema>) => {
    const weight = parseFloat(data.weight);
    let cost = 0;

    if (data.unit === "kg") {
      if (weight <= 3) {
        cost = 45;
      } else if (weight <= 10) {
        cost = weight * 18;
      } else {
        cost = weight * 15;
      }
    } else {
      if (weight <= 6) {
        cost = 45;
      } else if (weight <= 22) {
        cost = weight * 8.16;
      } else {
        cost = weight * 6.8;
      }
    }

    return Math.round(cost * 100) / 100;
  };

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    const cost = calculateShippingCost(data);
    toast({
      title: "Shipping Details Confirmed",
      description: (
        <div className="space-y-2">
          <p>Hello {data.name}, your estimated shipping cost is ${cost}.</p>
          <div className="mt-2">
            <p className="font-semibold">Your Details:</p>
            <p>Phone: {data.phoneNumber}</p>
            <p>Planned Drop-off: {format(data.shippingDate, 'MMMM do, yyyy')}</p>
          </div>
          <div className="mt-2">
            <p className="font-semibold">Drop-off Location:</p>
            <p>3111 Chillum Road</p>
            <p>Mount Rainer, MD</p>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            Please note: The weight will be verified at drop-off and final pricing may adjust if discrepancies arise.
          </p>
        </div>
      ),
      duration: 10000,
    });
  };

  return (
    <Card className="p-6 bg-white shadow-lg">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Ship to Ethiopia</h2>
          <p className="text-gray-600">Calculate your shipping costs based on package weight.</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your phone number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="weight"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Package Weight</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.1" placeholder="Enter weight" {...field} />
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
                    <FormLabel>Unit</FormLabel>
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

              <FormField
                control={form.control}
                name="shippingDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Planned Drop-off Date</FormLabel>
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
            </div>

            <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-white">
              Calculate Shipping Cost
            </Button>
          </form>
        </Form>

        <div className="mt-6 space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Shipping Rates Guide</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                <span className="bg-primary/10 text-primary px-2 py-1 rounded text-sm mr-2">KG</span>
                Kilogram Rates
              </h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">Up to 3 kg</span>
                  <span className="font-medium text-gray-900">$45 flat rate</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">3 - 10 kg</span>
                  <span className="font-medium text-gray-900">$18 per kg</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">Over 10 kg</span>
                  <span className="font-medium text-gray-900">$15 per kg</span>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                <span className="bg-primary/10 text-primary px-2 py-1 rounded text-sm mr-2">LB</span>
                Pound Rates
              </h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">Up to 6 lbs</span>
                  <span className="font-medium text-gray-900">$45 flat rate</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">6 - 22 lbs</span>
                  <span className="font-medium text-gray-900">$8.16 per lb</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">Over 22 lbs</span>
                  <span className="font-medium text-gray-900">$6.80 per lb</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg mt-4">
            <p className="text-sm text-blue-700">
              <strong>Example:</strong> A 8 kg package would cost $144 (8 kg × $18/kg), while a 20 lb package would cost $163.20 (20 lb × $8.16/lb).
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ShippingCalculator;