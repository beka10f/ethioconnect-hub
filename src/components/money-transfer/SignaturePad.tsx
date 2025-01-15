import { useEffect, useRef, useState } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import { Button } from '@/components/ui/button';

interface SignaturePadProps {
  onChange: (signature: string) => void;
}

const SignaturePad = ({ onChange }: SignaturePadProps) => {
  const signatureRef = useRef<SignatureCanvas>(null);
  const [isEmpty, setIsEmpty] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      if (signatureRef.current) {
        const canvas = signatureRef.current.getCanvas();
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleEnd = () => {
    setIsEmpty(signatureRef.current?.isEmpty() ?? true);
    if (signatureRef.current) {
      onChange(signatureRef.current.toDataURL());
    }
  };

  const handleClear = () => {
    signatureRef.current?.clear();
    setIsEmpty(true);
    onChange('');
  };

  return (
    <div className="space-y-2">
      <div className="border rounded-lg border-gray-200 bg-white">
        <SignatureCanvas
          ref={signatureRef}
          onEnd={handleEnd}
          canvasProps={{
            className: "w-full h-[200px] rounded-lg",
          }}
        />
      </div>
      <Button
        type="button"
        variant="outline"
        onClick={handleClear}
        disabled={isEmpty}
        className="w-full border-gray-200"
      >
        Clear Signature
      </Button>
    </div>
  );
};

export default SignaturePad;