import { ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface PortalProps {
  title: string;
  children: ReactNode;
}

const Portal = ({ title, children }: PortalProps) => {
  return (
    <Card className="bg-ethiopian-cream shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out overflow-hidden">
      <CardHeader className="pb-3 border-b border-gray-200/30">
        <CardTitle className="text-xl font-medium text-ethiopian-coffee tracking-tight text-left">
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