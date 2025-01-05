import Portal from "./Portal";

const CalendarPortal = () => {
  return (
    <Portal title="Ethiopian Calendar">
      <div className="text-center">
        <div className="text-2xl font-bold text-ethiopian-coffee mb-2">የካቲት 13, 2016 EC</div>
        <p className="text-sm text-gray-600">February 20, 2024 GC</p>
        <div className="mt-4 text-sm text-ethiopian-charcoal">
          <p>Upcoming Holiday:</p>
          <p className="font-medium">Victory of Adwa - March 2</p>
        </div>
        <button className="w-full mt-4 bg-ethiopian-sage text-white py-2 rounded-md hover:bg-opacity-90 transition-colors">
          View Full Calendar
        </button>
      </div>
    </Portal>
  );
};

export default CalendarPortal;