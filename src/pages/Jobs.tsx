import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import Header from "@/components/Header";

const Jobs = () => {
  const jobs = [
    {
      id: 1,
      title: "Restaurant Server",
      company: "Ethiopian Cuisine",
      location: "Silver Spring, MD",
      description: "Looking for an experienced server for our busy restaurant.",
      date: "2024-02-20",
      contactInfo: "jobs@ethiopiancuisine.com"
    },
    {
      id: 2,
      title: "Store Manager",
      company: "Habesha Market",
      location: "Alexandria, VA",
      description: "Seeking a detail-oriented store manager with retail experience.",
      date: "2024-02-19",
      contactInfo: "careers@habeshamarket.com"
    },
    {
      id: 3,
      title: "Delivery Driver",
      company: "Quick Delivery",
      location: "Washington, DC",
      description: "Join our delivery team. Must have valid driver's license.",
      date: "2024-02-18",
      contactInfo: "hr@quickdelivery.com"
    },
  ];

  return (
    <div className="min-h-screen bg-ethiopian-cream">
      <Header />
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-ethiopian-coffee">Job Listings</h1>
          <Link to="/post-job">
            <Button className="bg-ethiopian-coffee text-white hover:bg-ethiopian-coffee/90">
              Post a Job
            </Button>
          </Link>
        </div>
        
        <div className="grid gap-6">
          {jobs.map((job) => (
            <div 
              key={job.id} 
              className="bg-white rounded-lg shadow-md p-6 border border-ethiopian-sage/20 hover:border-ethiopian-sage/40 transition-colors duration-200"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-xl font-semibold text-ethiopian-coffee">{job.title}</h2>
                  <p className="text-ethiopian-gold font-medium">{job.company}</p>
                  <p className="text-ethiopian-charcoal/70">{job.location}</p>
                </div>
                <span className="text-sm text-ethiopian-charcoal/60">{job.date}</span>
              </div>
              
              <p className="text-ethiopian-charcoal/80 mb-4">{job.description}</p>
              
              <div className="flex justify-between items-center">
                <p className="text-sm text-ethiopian-charcoal/70">Contact: {job.contactInfo}</p>
                <Link to={`/jobs/${job.id}`}>
                  <Button 
                    variant="outline" 
                    className="border-ethiopian-coffee text-ethiopian-coffee hover:bg-ethiopian-coffee hover:text-white transition-colors duration-200"
                  >
                    View Details
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Jobs;