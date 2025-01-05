import { ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface PortalProps {
  title: string;
  children: ReactNode;
}

const Portal = ({ title, children }: PortalProps) => {
  return (
    <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader>
        <CardTitle className="text-ethiopian-coffee text-xl font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
};

export default Portal;