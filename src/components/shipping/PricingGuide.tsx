import React from "react";
import { ChevronDown } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

const PricingGuide = () => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="mt-6 space-y-4"
    >
      <CollapsibleTrigger className="flex items-center justify-between w-full p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
        <h3 className="text-lg font-semibold text-gray-900">Shipping Rates Guide</h3>
        <ChevronDown
          className={`w-5 h-5 text-gray-600 transition-transform duration-200 ${
            isOpen ? "transform rotate-180" : ""
          }`}
        />
      </CollapsibleTrigger>

      <CollapsibleContent className="space-y-4">
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
      </CollapsibleContent>
    </Collapsible>
  );
};

export default PricingGuide;