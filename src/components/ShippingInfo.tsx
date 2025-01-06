import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ShippingInfo() {
  return (
    <Card className="mt-8 bg-ethiopian-cream text-ethiopian-coffee">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">Ship to Ethiopia</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">User Enters Package Details</h3>
            <p className="text-sm">
              Provide essential shipment information including package weight,
              measurement unit (kg/lbs), pickup location, and preferred shipping speed.
            </p>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Weight-Based Pricing</h3>
            <p className="text-sm">
              Pricing is structured based on weight categories. Packages under 3 kg
              or 6 lbs have a flat rate, with incremental pricing for heavier items.
            </p>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Shipping Speed Options</h3>
            <p className="text-sm">
              Choose from various delivery speeds to match your needs, with
              corresponding pricing adjustments for express or expedited services.
            </p>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Price Calculation</h3>
            <p className="text-sm">
              Total shipping cost is calculated based on weight, unit, and chosen
              speed, including any applicable express delivery fees.
            </p>
          </div>
        </div>
        
        <div className="mt-6 p-4 bg-ethiopian-sage/10 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Summary and Confirmation</h3>
          <p className="text-sm">
            Review your shipping details including weight, unit, location, shipping
            speed, and final price before proceeding with your booking.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}