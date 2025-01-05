import Portal from "./Portal";

const RentalsPortal = () => {
  const rentals = [
    { type: "1 Bedroom Apartment", location: "Takoma Park, MD", price: "$1,400/mo" },
    { type: "2 Bedroom House", location: "Falls Church, VA", price: "$2,200/mo" },
    { type: "Studio Apartment", location: "Adams Morgan, DC", price: "$1,200/mo" },
  ];

  return (
    <Portal title="Featured Rentals">
      <div className="space-y-4">
        {rentals.map((rental, index) => (
          <div key={index} className="group border-b border-gray-100/50 last:border-0 pb-3 hover:bg-blue-50/50 rounded-lg transition-colors duration-200 -mx-2 px-2">
            <h3 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">{rental.type}</h3>
            <p className="text-sm text-gray-600">{rental.location}</p>
            <p className="text-sm font-medium text-blue-600">{rental.price}</p>
          </div>
        ))}
        <button className="w-full mt-4 bg-blue-600/90 backdrop-blur-sm text-white py-2.5 rounded-xl hover:bg-blue-700 transition-colors duration-200">
          View All Rentals
        </button>
      </div>
    </Portal>
  );
};

export default RentalsPortal;