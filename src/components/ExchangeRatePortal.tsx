import Portal from "./Portal";

const ExchangeRatePortal = () => {
  return (
    <Portal title="Exchange Rate">
      <div className="text-center">
        <div className="text-3xl font-bold text-ethiopian-coffee mb-2">1 USD = 56.50 ETB</div>
        <p className="text-sm text-gray-600">Last updated: Feb 20, 2024</p>
        <button className="w-full mt-4 bg-ethiopian-sage text-white py-2 rounded-md hover:bg-opacity-90 transition-colors">
          View Historical Rates
        </button>
      </div>
    </Portal>
  );
};

export default ExchangeRatePortal;