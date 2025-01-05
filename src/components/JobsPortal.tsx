import { useState } from "react";
import Portal from "./Portal";
import { Button } from "./ui/button";
import JobPostingForm from "./JobPostingForm";
import { toast } from "sonner";

const JobsPortal = () => {
  const [showPostingForm, setShowPostingForm] = useState(false);
  const recentJobs = [
    { 
      id: 1,
      title: "Restaurant Server",
      company: "Ethiopian Cuisine",
      location: "Silver Spring, MD",
      description: "Join our team as a server in an authentic Ethiopian restaurant.",
      date: "2024-02-20"
    },
    {
      id: 2,
      title: "Store Manager",
      company: "Habesha Market",
      location: "Alexandria, VA",
      description: "Experienced store manager needed for Ethiopian grocery store.",
      date: "2024-02-19"
    },
    {
      id: 3,
      title: "Delivery Driver",
      company: "Quick Delivery",
      location: "Washington, DC",
      description: "Full-time delivery driver position available.",
      date: "2024-02-18"
    },
  ];

  const handleJobSubmit = (formData: any) => {
    // In a real app, this would send the data to a backend
    console.log("Job posting submitted:", formData);
    toast.success("Job posting submitted for review!");
    setShowPostingForm(false);
  };

  return (
    <Portal title="Recent Job Postings">
      <div className="space-y-4">
        {!showPostingForm ? (
          <>
            {recentJobs.map((job) => (
              <div 
                key={job.id} 
                className="group border-b border-gray-100/50 last:border-0 pb-4 hover:bg-blue-50/50 rounded-lg transition-colors duration-200 -mx-2 px-2"
              >
                <h3 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                  {job.title}
                </h3>
                <p className="text-sm text-gray-600 mt-1">{job.company}</p>
                <p className="text-sm text-gray-600">{job.location}</p>
                <p className="text-sm text-gray-700 mt-2">{job.description}</p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-2"
                >
                  View Details
                </Button>
              </div>
            ))}
            <Button 
              className="w-full mt-4" 
              onClick={() => setShowPostingForm(true)}
            >
              Post a Job
            </Button>
          </>
        ) : (
          <JobPostingForm 
            onSubmit={handleJobSubmit}
            onCancel={() => setShowPostingForm(false)}
          />
        )}
      </div>
    </Portal>
  );
};

export default JobsPortal;