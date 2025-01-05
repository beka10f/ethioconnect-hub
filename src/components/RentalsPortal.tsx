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
          <div key={index} className="border-b last:border-0 pb-3">
            <h3 className="font-medium text-ethiopian-charcoal">{rental.type}</h3>
            <p className="text-sm text-gray-600">{rental.location}</p>
            <p className="text-sm font-medium text-ethiopian-coffee">{rental.price}</p>
          </div>
        ))}
        <button className="w-full mt-4 bg-ethiopian-sage text-white py-2 rounded-md hover:bg-opacity-90 transition-colors">
          View All Rentals
        </button>
      </div>
    </Portal>
  );
};

export default RentalsPortal;