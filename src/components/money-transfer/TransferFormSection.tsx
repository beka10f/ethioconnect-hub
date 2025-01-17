import { ReactNode } from "react";

interface TransferFormSectionProps {
  title: string;
  children: ReactNode;
  icon?: ReactNode;
}

export const TransferFormSection = ({
  title,
  children,
  icon,
}: TransferFormSectionProps) => {
  return (
    <div className="space-y-4 p-4 bg-gray-50/50 rounded-lg border border-gray-100">
      <div className="flex items-center gap-2 text-gray-900">
        {icon && <span className="text-blue-600">{icon}</span>}
        <h3 className="font-medium">{title}</h3>
      </div>
      {children}
    </div>
  );
};