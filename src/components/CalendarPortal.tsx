import Portal from "./Portal";

const CalendarPortal = () => {
  return (
    <Portal title="Ethiopian Calendar">
      <div className="text-center space-y-4">
        <div className="text-2xl font-medium text-ethiopian-coffee tracking-tight">የካቲት 13, 2016 EC</div>
        <p className="text-sm text-gray-600">February 20, 2024 GC</p>
        <div className="mt-4 text-sm text-ethiopian-charcoal">
          <p>Upcoming Holiday:</p>
          <p className="font-medium">Victory of Adwa - March 2</p>
        </div>
        <button className="w-full mt-4 bg-ethiopian-sage/90 backdrop-blur-sm text-white py-2.5 rounded-xl hover:bg-ethiopian-sage transition-colors duration-200">
          View Full Calendar
        </button>
      </div>
    </Portal>
  );
};

export default CalendarPortal;