import Portal from "./Portal";

const BusinessDirectoryPortal = () => {
  const businesses = [
    { name: "Chercher Ethiopian Restaurant", type: "Restaurant", location: "Washington, DC" },
    { name: "Habesha Market", type: "Grocery Store", location: "Alexandria, VA" },
    { name: "Ethiopic", type: "Restaurant", location: "Washington, DC" },
  ];

  return (
    <Portal title="Business Directory">
      <div className="space-y-4">
        {businesses.map((business, index) => (
          <div key={index} className="border-b last:border-0 pb-3">
            <h3 className="font-medium text-ethiopian-charcoal">{business.name}</h3>
            <p className="text-sm text-gray-600">{business.type}</p>
            <p className="text-sm text-gray-600">{business.location}</p>
          </div>
        ))}
        <button className="w-full mt-4 bg-ethiopian-sage text-white py-2 rounded-md hover:bg-opacity-90 transition-colors">
          View Full Directory
        </button>
      </div>
    </Portal>
  );
};

export default BusinessDirectoryPortal;