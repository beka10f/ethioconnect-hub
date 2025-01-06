import { ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface PortalProps {
  title: string;
  children: ReactNode;
}

const Portal = ({ title, children }: PortalProps) => {
  return (
    <Card className="bg-white shadow-md hover:shadow-lg transition-all duration-300 ease-in-out rounded-lg border border-gray-100">
      <CardHeader className="pb-2 border-b border-gray-100 px-6 py-4">
        <CardTitle className="text-lg font-semibold text-gray-900">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4 px-6 pb-6">
        {children}
      </CardContent>
    </Card>
  );
};

export default Portal;