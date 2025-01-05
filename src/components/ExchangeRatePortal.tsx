import Portal from "./Portal";

const ExchangeRatePortal = () => {
  return (
    <Portal title="Exchange Rate">
      <div className="text-center space-y-4">
        <div className="text-3xl font-medium text-ethiopian-coffee tracking-tight">1 USD = 56.50 ETB</div>
        <p className="text-sm text-gray-600">Last updated: Feb 20, 2024</p>
        <button className="w-full mt-4 bg-ethiopian-sage/90 backdrop-blur-sm text-white py-2.5 rounded-xl hover:bg-ethiopian-sage transition-colors duration-200">
          View Historical Rates
        </button>
      </div>
    </Portal>
  );
};

export default ExchangeRatePortal;