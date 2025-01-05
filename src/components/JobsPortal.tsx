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
          <div key={index} className="group border-b border-gray-100/50 last:border-0 pb-3 hover:bg-blue-50/50 rounded-lg transition-colors duration-200 -mx-2 px-2">
            <h3 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">{job.title}</h3>
            <p className="text-sm text-gray-600">{job.location}</p>
          </div>
        ))}
        <button className="w-full mt-4 bg-blue-600/90 backdrop-blur-sm text-white py-2.5 rounded-xl hover:bg-blue-700 transition-colors duration-200">
          View All Jobs
        </button>
      </div>
    </Portal>
  );
};

export default JobsPortal;