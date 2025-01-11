import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";

const FormSubmissionsManagement = () => {
  const { data: jobApplications, isLoading: isLoadingJobs } = useQuery({
    queryKey: ["job-applications"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("job_applications")
        .select(`
          *,
          jobs:jobs(title)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  if (isLoadingJobs) {
    return <div>Loading submissions...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900">Form Submissions</h2>
        <p className="text-sm text-gray-500 mt-1">
          View and manage all form submissions
        </p>
      </div>

      <Tabs defaultValue="jobs" className="space-y-4">
        <TabsList className="bg-white/70 backdrop-blur-sm border border-gray-200/50">
          <TabsTrigger value="jobs" className="data-[state=active]:bg-site-blue data-[state=active]:text-white">
            Job Applications
          </TabsTrigger>
        </TabsList>

        <TabsContent value="jobs">
          <Card className="bg-white/70 backdrop-blur-sm border-gray-200/50">
            <CardHeader>
              <CardTitle>Job Applications</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[calc(100vh-25rem)]">
                <Table>
                  <TableHeader className="bg-gray-50/50 backdrop-blur-sm sticky top-0 z-10">
                    <TableRow>
                      <TableHead className="font-medium">Job Title</TableHead>
                      <TableHead className="font-medium">Applicant</TableHead>
                      <TableHead className="font-medium hidden sm:table-cell">Email</TableHead>
                      <TableHead className="font-medium hidden md:table-cell">Phone</TableHead>
                      <TableHead className="font-medium">Status</TableHead>
                      <TableHead className="font-medium hidden sm:table-cell">Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {jobApplications?.map((application) => (
                      <TableRow key={application.id} className="hover:bg-blue-50/50">
                        <TableCell>{application.jobs?.title}</TableCell>
                        <TableCell>{application.full_name}</TableCell>
                        <TableCell className="hidden sm:table-cell">{application.email}</TableCell>
                        <TableCell className="hidden md:table-cell">{application.phone}</TableCell>
                        <TableCell>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {application.status}
                          </span>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          {new Date(application.created_at).toLocaleDateString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FormSubmissionsManagement;