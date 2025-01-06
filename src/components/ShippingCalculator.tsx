import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";

const formSchema = z.object({
  weight: z.string().min(1, "Weight is required"),
  unit: z.enum(["kg", "lbs"]),
  speed: z.enum(["standard", "express", "priority"]),
});

const ShippingCalculator = () => {
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      weight: "",
      unit: "kg",
      speed: "standard",
    },
  });

  const calculateShippingCost = (data: z.infer<typeof formSchema>) => {
    const weight = parseFloat(data.weight);
    const baseRate = data.unit === "kg" ? 10 : 4.54; // $10 per kg or $4.54 per lb
    let cost = 0;

    // Weight-based pricing
    if (data.unit === "kg") {
      if (weight <= 3) {
        cost = 30; // Flat rate for packages under 3kg
      } else {
        cost = weight * baseRate;
      }
    } else {
      if (weight <= 6) {
        cost = 30; // Flat rate for packages under 6lbs
      } else {
        cost = weight * baseRate;
      }
    }

    // Speed multipliers
    const speedMultipliers = {
      standard: 1,
      express: 1.5,
      priority: 2,
    };

    cost *= speedMultipliers[data.speed];

    return Math.round(cost * 100) / 100; // Round to 2 decimal places
  };

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    const cost = calculateShippingCost(data);
    toast({
      title: "Shipping Cost Calculation",
      description: `Estimated cost: $${cost}`,
    });
  };

  return (
    <Card className="p-6 bg-white">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-black mb-2">Ship to Ethiopia</h2>
          <p className="text-gray-700 mb-4">Calculate your shipping costs based on package details.</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                name="speed"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Shipping Speed</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select speed" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="standard">Standard (7-10 days)</SelectItem>
                        <SelectItem value="express">Express (3-5 days)</SelectItem>
                        <SelectItem value="priority">Priority (1-2 days)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button type="submit" className="w-full bg-[#0EA5E9] hover:bg-[#0891CE] text-white">
              Calculate Shipping Cost
            </Button>
          </form>
        </Form>
      </div>
    </Card>
  );
};

export default ShippingCalculator;