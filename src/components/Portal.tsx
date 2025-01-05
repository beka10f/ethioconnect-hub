import { ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface PortalProps {
  title: string;
  children: ReactNode;
}

const Portal = ({ title, children }: PortalProps) => {
  return (
    <Card className="bg-white/60 backdrop-blur-sm border border-gray-100 rounded-2xl hover:shadow-lg transition-all duration-300 ease-in-out">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl font-medium text-ethiopian-coffee tracking-tight">{title}</CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
};

export default Portal;