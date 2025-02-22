import Portal from "./Portal";
import { Calendar } from "@/components/ui/calendar";

const CalendarPortal = () => {
  return (
    <Portal title="Ethiopian Calendar">
      <div className="space-y-4">
        <div className="text-sm text-gray-600 mb-2">February 20, 2024 GC | የካቲት 13, 2016 EC</div>
        <Calendar
          mode="single"
          className="rounded-md border shadow-sm"
        />
        <div className="text-sm text-gray-900">
          <p>Upcoming Holiday:</p>
          <p className="font-medium text-blue-600">Victory of Adwa - March 2</p>
        </div> 
      </div>
    </Portal>
  );
};

export default CalendarPortal;