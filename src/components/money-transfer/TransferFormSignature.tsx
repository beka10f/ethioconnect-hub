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
    <div className="space-y-2">
      <label className="block text-gray-900 font-medium">Digital Signature</label>
      <div className="border rounded-md bg-white">
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
      >
        Clear Signature
      </Button>
    </div>
  );
};