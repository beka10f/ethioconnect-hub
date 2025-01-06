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

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  weight: z.string().min(1, "Weight is required"),
  unit: z.enum(["kg", "lbs"]),
});

const ShippingCalculator = () => {
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      weight: "",
      unit: "kg",
    },
  });

  const calculateShippingCost = (data: z.infer<typeof formSchema>) => {
    const weight = parseFloat(data.weight);
    let cost = 0;

    if (data.unit === "kg") {
      if (weight <= 3) {
        cost = 45; // Flat rate for packages under 3kg
      } else if (weight <= 10) {
        cost = weight * 18; // $18 per kg for 3-10kg
      } else {
        cost = weight * 15; // $15 per kg for over 10kg
      }
    } else {
      if (weight <= 6) {
        cost = 45; // Flat rate for packages under 6lbs
      } else if (weight <= 22) {
        cost = weight * 8.16; // $8.16 per lb for 6-22lbs
      } else {
        cost = weight * 6.8; // $6.8 per lb for over 22lbs
      }
    }

    return Math.round(cost * 100) / 100; // Round to 2 decimal places
  };

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    const cost = calculateShippingCost(data);
    toast({
      title: "Shipping Cost Calculation",
      description: (
        <div className="space-y-2">
          <p>Hello {data.name}, your estimated shipping cost is ${cost}.</p>
          <p className="font-semibold">Drop-off Location:</p>
          <p>3111 Chillum Road</p>
          <p>Mount Rainer, MD</p>
          <p className="text-sm text-muted-foreground mt-2">
            Please note: The weight will be verified at drop-off and final pricing may adjust if discrepancies arise.
          </p>
        </div>
      ),
      duration: 10000, // Show for 10 seconds so user can read the address
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
            </div>

            <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-white">
              Calculate Shipping Cost
            </Button>
          </form>
        </Form>

        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold text-gray-900 mb-2">Pricing Guide</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
            <div>
              <p className="font-medium">Kilograms (kg):</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Up to 3kg: $45 flat rate</li>
                <li>3-10kg: $18 per kg</li>
                <li>Over 10kg: $15 per kg</li>
              </ul>
            </div>
            <div>
              <p className="font-medium">Pounds (lbs):</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Up to 6lbs: $45 flat rate</li>
                <li>6-22lbs: $8.16 per lb</li>
                <li>Over 22lbs: $6.8 per lb</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ShippingCalculator;