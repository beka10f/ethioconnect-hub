import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormMessage } from "@/components/ui/form";
import { UseFormRegisterReturn } from "react-hook-form";

interface FormFieldProps {
  label: string;
  id: string;
  type?: string;
  placeholder?: string;
  registration: UseFormRegisterReturn;
  error?: string;
  className?: string;
}

export const FormField = ({
  label,
  id,
  type = "text",
  placeholder,
  registration,
  error,
  className,
}: FormFieldProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-gray-900 font-medium">
        {label}
      </Label>
      <Input
        id={id}
        type={type}
        className={className}
        placeholder={placeholder}
        {...registration}
      />
      {error && <FormMessage className="text-red-500">{error}</FormMessage>}
    </div>
  );
};