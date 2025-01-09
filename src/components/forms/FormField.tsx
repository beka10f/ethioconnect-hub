import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormMessage } from "@/components/ui/form";
import { UseFormRegisterReturn } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";

interface FormFieldProps {
  label: string;
  id: string;
  type?: string;
  placeholder?: string;
  registration: UseFormRegisterReturn;
  error?: string;
  className?: string;
  textarea?: boolean;
}

export const FormField = ({
  label,
  id,
  type = "text",
  placeholder,
  registration,
  error,
  className,
  textarea = false,
}: FormFieldProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-left block text-gray-900 font-medium">
        {label}
      </Label>
      {textarea ? (
        <Textarea
          id={id}
          className={className}
          placeholder={placeholder}
          {...registration}
        />
      ) : (
        <Input
          id={id}
          type={type}
          className={className}
          placeholder={placeholder}
          {...registration}
        />
      )}
      {error && <FormMessage className="text-red-500">{error}</FormMessage>}
    </div>
  );
};