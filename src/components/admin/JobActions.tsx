import { Button } from "@/components/ui/button";
import { useJobApproval } from "@/hooks/useJobApproval";
import { CheckCircle, XCircle } from "lucide-react";

interface JobActionsProps {
  jobId: string;
  onUpdate: () => void;
  showActions: boolean;
}

const JobActions = ({ jobId, onUpdate, showActions }: JobActionsProps) => {
  const { handleApproval, isUpdating } = useJobApproval(onUpdate);

  if (!showActions) return null;

  return (
    <>
      <Button
        type="button"
        variant="outline"
        disabled={isUpdating}
        className="flex-1 h-9 border-green-600 text-green-600 hover:bg-green-600 hover:text-white disabled:opacity-50"
        onClick={() => handleApproval(jobId, "approve")}
      >
        <CheckCircle className="w-4 h-4 sm:mr-2" />
        <span className="hidden sm:inline">{isUpdating ? 'Processing...' : 'Approve'}</span>
      </Button>
      <Button
        type="button"
        variant="outline"
        disabled={isUpdating}
        className="flex-1 h-9 border-red-500 text-red-500 hover:bg-red-500 hover:text-white disabled:opacity-50"
        onClick={() => handleApproval(jobId, "reject")}
      >
        <XCircle className="w-4 h-4 sm:mr-2" />
        <span className="hidden sm:inline">{isUpdating ? 'Processing...' : 'Reject'}</span>
      </Button>
    </>
  );
};

export default JobActions;