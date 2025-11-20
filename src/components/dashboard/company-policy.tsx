import { CircleAlert, FileText, Paperclip } from "lucide-react";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { truncateString } from "@/lib/utils";
import DocumentViewer from "../document-viewer";
import { Button } from "../ui/button";

interface Policy {
  id: string;
  file_name: string;
  file_data?: string;
}

const mockPolicies: Policy[] = [
  {
    id: "1",
    file_name: "Company Handbook.pdf",
    file_data: "Sample company handbook content...",
  },
  {
    id: "2",
    file_name: "Code of Conduct.pdf",
    file_data: "Sample code of conduct content...",
  },
];

const CulturePolicies = () => {
  const [open, setOpen] = useState(false);
  const [selectedPolicy, setSelectedPolicy] = useState<Policy | null>(null);
  const data = mockPolicies;

  const handleOpenModal = (policy: Policy) => {
    setSelectedPolicy(policy);
    setOpen(true);
  };

  return (
    <>
      <Card className="h-full w-full shadow-none">
        <CardHeader>
          <CardTitle className="font-semibold text-primary text-xl">Company Documents</CardTitle>
        </CardHeader>
        <CardContent className="h-full space-y-4 overflow-y-scroll lg:h-[618px]">
          <div className="flex flex-col items-start gap-2.5">
            {data && data.length > 0 ? (
              data.map((policy: Policy, idx: number) => (
                <div key={policy.id ?? idx} className="flex w-full items-center justify-center gap-2.5 border-b pb-3">
                  <div className="size-10 rounded-full bg-primary p-2 text-white">
                    <FileText className="size-full" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-sm">{truncateString(policy.file_name, 20)}</h3>
                  </div>
                  <Button size="icon" variant="ghost" onClick={() => handleOpenModal(policy)}>
                    <Paperclip className="size-4 text-muted-foreground" />
                  </Button>
                </div>
              ))
            ) : (
              <p className="flex h-full w-full flex-col items-center justify-center text-muted-foreground lg:h-[618px]">
                <CircleAlert className="size-8 text-primary" />
                No documents found.
              </p>
            )}
          </div>
        </CardContent>
      </Card>
      <DocumentViewer
        open={open}
        document={selectedPolicy?.file_data ?? ""}
        documentName={selectedPolicy?.file_name ?? ""}
        setOpen={setOpen}
      />
    </>
  );
};

export default CulturePolicies;
