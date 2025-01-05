import Portal from "./Portal";

const JobsPortal = () => {
  const recentJobs = [
    { title: "Restaurant Server", location: "Silver Spring, MD", date: "2024-02-20" },
    { title: "Store Manager", location: "Alexandria, VA", date: "2024-02-19" },
    { title: "Delivery Driver", location: "Washington, DC", date: "2024-02-18" },
  ];

  return (
    <Portal title="Recent Job Postings">
      <div className="space-y-4">
        {recentJobs.map((job, index) => (
          <div key={index} className="border-b last:border-0 pb-3">
            <h3 className="font-medium text-ethiopian-charcoal">{job.title}</h3>
            <p className="text-sm text-gray-600">{job.location}</p>
          </div>
        ))}
        <button className="w-full mt-4 bg-ethiopian-sage text-white py-2 rounded-md hover:bg-opacity-90 transition-colors">
          View All Jobs
        </button>
      </div>
    </Portal>
  );
};

export default JobsPortal;