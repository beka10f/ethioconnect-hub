import { Check } from "lucide-react";

interface TransferStepsProps {
  currentStep: number;
}

export const TransferSteps = ({ currentStep }: TransferStepsProps) => {
  const steps = [
    "Enter Transfer Details",
    "Verify and Complete Payment"
  ];

  return (
    <div className="relative mb-8">
      <div className="absolute left-0 top-[15px] w-full h-0.5 bg-gray-200">
        <div 
          className="absolute left-0 top-0 h-full bg-blue-600 transition-all duration-300"
          style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
        />
      </div>
      <div className="relative flex justify-between">
        {steps.map((step, index) => (
          <div 
            key={step}
            className="flex flex-col items-center"
          >
            <div 
              className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors duration-300 ${
                index <= currentStep 
                  ? "border-blue-600 bg-blue-600 text-white"
                  : "border-gray-300 bg-white text-gray-500"
              }`}
            >
              {index < currentStep ? (
                <Check className="w-4 h-4" />
              ) : (
                index + 1
              )}
            </div>
            <span className="mt-2 text-sm text-gray-600 text-center max-w-[120px]">
              {step}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};