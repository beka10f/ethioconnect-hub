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
          <div key={index} className="group border-b border-gray-100/50 last:border-0 pb-3 hover:bg-blue-50/50 rounded-lg transition-colors duration-200 -mx-2 px-2">
            <h3 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">{business.name}</h3>
            <p className="text-sm text-gray-600">{business.type}</p>
            <p className="text-sm text-gray-600">{business.location}</p>
          </div>
        ))}
        <button className="w-full mt-4 bg-blue-600/90 backdrop-blur-sm text-white py-2.5 rounded-xl hover:bg-blue-700 transition-colors duration-200">
          View Full Directory
        </button>
      </div>
    </Portal>
  );
};

export default BusinessDirectoryPortal;