import { Button } from "@/components/ui/button";
import { useJobApproval } from "@/hooks/useJobApproval";

interface JobActionsProps {
  jobId: string;
  onUpdate: () => void;
  showActions: boolean;
}

const JobActions = ({ jobId, onUpdate, showActions }: JobActionsProps) => {
  const { handleApproval, isUpdating } = useJobApproval(onUpdate);

  if (!showActions) return null;

  return (
    <div className="flex gap-2">
      <Button
        type="button"
        variant="outline"
        disabled={isUpdating}
        className="border-green-600 text-green-600 hover:bg-green-600 hover:text-white disabled:opacity-50"
        onClick={() => handleApproval(jobId, "approve")}
      >
        {isUpdating ? 'Processing...' : 'Approve'}
      </Button>
      <Button
        type="button"
        variant="outline"
        disabled={isUpdating}
        className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white disabled:opacity-50"
        onClick={() => handleApproval(jobId, "reject")}
      >
        {isUpdating ? 'Processing...' : 'Reject'}
      </Button>
    </div>
  );
};

export default JobActions;