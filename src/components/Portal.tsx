import { ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface PortalProps {
  title: string;
  children: ReactNode;
}

const Portal = ({ title, children }: PortalProps) => {
  return (
    <Card className="bg-white shadow-sm hover:shadow-md transition-all duration-300 ease-in-out overflow-hidden rounded-lg border border-gray-100 h-full">
      <CardHeader className="pb-2 sm:pb-3 border-b border-gray-100 px-3 py-2 sm:px-6 sm:py-4">
        <CardTitle className="text-base sm:text-lg font-semibold text-site-black text-left">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-2 sm:pt-3 px-3 pb-3 sm:px-6 sm:pb-6">
        {children}
      </CardContent>
    </Card>
  );
};

export default Portal;