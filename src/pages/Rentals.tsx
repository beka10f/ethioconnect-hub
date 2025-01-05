import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Rentals = () => {
  const rentalListings = [
    {
      id: 1,
      title: "Modern 2 Bedroom Apartment",
      price: "$1,800/month",
      location: "Silver Spring, MD",
      rooms: "2 Bedrooms, 2 Baths",
      thumbnail: "https://images.unsplash.com/photo-1487958449943-2429e8be8625",
      description: "Newly renovated apartment with modern amenities",
    },
    {
      id: 2,
      title: "Cozy Studio Near Metro",
      price: "$1,200/month",
      location: "Arlington, VA",
      rooms: "Studio, 1 Bath",
      thumbnail: "https://images.unsplash.com/photo-1524230572899-a752b3835840",
      description: "Perfect for young professionals, walking distance to metro",
    },
    {
      id: 3,
      title: "Spacious Family Home",
      price: "$2,500/month",
      location: "Alexandria, VA",
      rooms: "3 Bedrooms, 2.5 Baths",
      thumbnail: "https://images.unsplash.com/photo-1486718448742-163732cd1544",
      description: "Beautiful single-family home in quiet neighborhood",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-blue-50">
      <Header />
      <main className="container mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Rental Listings</h1>
          <Link to="/post-rental">
            <Button className="bg-blue-600 hover:bg-blue-700">
              Post a Rental
            </Button>
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rentalListings.map((rental) => (
            <div
              key={rental.id}
              className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              <img
                src={rental.thumbnail}
                alt={rental.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {rental.title}
                </h3>
                <p className="text-blue-600 font-bold mb-2">{rental.price}</p>
                <p className="text-gray-600 mb-1">{rental.location}</p>
                <p className="text-gray-600 mb-3">{rental.rooms}</p>
                <p className="text-gray-700 mb-4 line-clamp-2">
                  {rental.description}
                </p>
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  View Details
                </Button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Rentals;