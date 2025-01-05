import { ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface PortalProps {
  title: string;
  children: ReactNode;
}

const Portal = ({ title, children }: PortalProps) => {
  return (
    <Card className="bg-white/80 backdrop-blur-md border border-gray-100/50 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out overflow-hidden">
      <CardHeader className="pb-3 border-b border-gray-100/20">
        <CardTitle className="text-xl font-medium text-gray-800 tracking-tight">{title}</CardTitle>
      </CardHeader>
      <CardContent className="bg-gradient-to-b from-transparent to-blue-50/30">{children}</CardContent>
    </Card>
  );
};

export default Portal;