import { ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface PortalProps {
  title: string;
  children: ReactNode;
}

const Portal = ({ title, children }: PortalProps) => {
  return (
    <Card className="bg-white/80 backdrop-blur-md border border-gray-100/50 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 ease-in-out overflow-hidden">
      <CardHeader className="pb-3 border-b border-gray-100/20">
        <CardTitle className="text-2xl font-semibold text-ethiopian-coffee tracking-tight text-left">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="bg-gradient-to-b from-transparent to-blue-50/30 pt-6">
        {children}
      </CardContent>
    </Card>
  );
};

export default Portal;