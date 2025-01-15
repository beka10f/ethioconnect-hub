import { Button } from "@/components/ui/button";
import SignaturePad from "react-signature-canvas";

interface TransferFormSignatureProps {
  signature: any;
  setSignature: (ref: any) => void;
}

export const TransferFormSignature = ({
  signature,
  setSignature,
}: TransferFormSignatureProps) => {
  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-900">Digital Signature</label>
      <div className="border rounded-lg bg-white overflow-hidden">
        <SignaturePad
          ref={(ref) => setSignature(ref)}
          canvasProps={{
            className: "w-full h-40",
          }}
        />
      </div>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => signature?.clear()}
        className="text-sm"
      >
        Clear Signature
      </Button>
    </div>
  );
};