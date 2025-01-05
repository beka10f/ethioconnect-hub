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
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import Header from "@/components/Header";

const formSchema = z.object({
  title: z.string().min(2, "Property title must be at least 2 characters"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  price: z.string().min(1, "Price is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  contactInfo: z.string().email("Invalid email address"),
});

const PostRental = () => {
  const navigate = useNavigate();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      address: "",
      price: "",
      description: "",
      contactInfo: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    toast.success("Rental listing submitted for review!");
    navigate("/rentals");
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-blue-50">
      <Header />
      <div className="container mx-auto py-8 px-4 max-w-2xl">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Post a Rental</h1>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Property Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Modern 2 Bedroom Apartment" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. 123 Main St, Silver Spring, MD" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price (per month)</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. $1,500" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Property Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Describe the property features, amenities, and requirements..."
                      className="min-h-[120px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="contactInfo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="e.g. contact@email.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-4">
              <Button 
                type="submit"
                className="bg-blue-600 hover:bg-blue-700"
              >
                Submit Rental Listing
              </Button>
              <Button 
                type="button" 
                variant="outline"
                onClick={() => navigate("/rentals")}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default PostRental;