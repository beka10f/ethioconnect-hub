import { ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface PortalProps {
  title: string;
  children: ReactNode;
}

const Portal = ({ title, children }: PortalProps) => {
  return (
    <Card className="bg-white shadow-md hover:shadow-lg transition-all duration-300 ease-in-out overflow-hidden rounded-xl border border-gray-100">
      <CardHeader className="pb-2 border-b border-gray-100">
        <CardTitle className="text-xl font-bold text-gray-900 tracking-tight">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        {children}
      </CardContent>
    </Card>
  );
};

export default Portal;