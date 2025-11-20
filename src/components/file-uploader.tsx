import { X } from "lucide-react";
import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface UploadModalProps {
  open: boolean;
  onClose: () => void;
  onUpload: (files: File[]) => void;
  companyId?: string;
  employeeId?: string;
}

const UploadModal = ({ open, onClose, onUpload, companyId, employeeId }: UploadModalProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        setUploadedFiles((prev) => [...prev, ...acceptedFiles]);
      }
    },
    multiple: true,
    accept: {
      "application/pdf": [],
    },
  });

  const handleRemoveFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (!uploadedFiles.length) return;

    setIsLoading(true);

    // Simulate file upload
    setTimeout(() => {
      setIsLoading(false);
      toast.success("File uploaded successfully!");
      onUpload(uploadedFiles);
      setUploadedFiles([]);
      onClose();
    }, 1000);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-semibold text-lg">Upload Files</DialogTitle>
        </DialogHeader>

        <div
          {...getRootProps()}
          className="flex w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-border border-dashed bg-muted/30 px-5 py-10 text-center transition hover:bg-muted/50"
        >
          <input {...getInputProps()} />

          {isDragActive ? (
            <span className="font-medium text-base">Drop the files here...</span>
          ) : (
            <>
              <span className="font-medium text-base">Drag & Drop PDF files here</span>
              <span className="text-muted-foreground text-sm">You can upload multiple files</span>
            </>
          )}
        </div>

        {uploadedFiles.length > 0 && (
          <div className="mt-4 flex max-h-48 gap-2 overflow-x-auto">
            {uploadedFiles.map((file, index) => (
              <Badge key={index} className="flex items-center justify-between rounded-md border px-2 text-xs">
                <span className="max-w-[75%] truncate">{file.name}</span>
                <button
                  onClick={() => handleRemoveFile(index)}
                  className="text-muted-foreground hover:text-destructive"
                >
                  <X className="size-4" />
                </button>
              </Badge>
            ))}
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" onClick={handleUpload} disabled={isLoading || uploadedFiles.length === 0}>
            {isLoading ? "Uploading..." : "Upload"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UploadModal;
