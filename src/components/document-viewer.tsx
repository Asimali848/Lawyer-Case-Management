import MDEditor from "@uiw/react-md-editor";
import { Download, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { downloadMarkdownAsPDF } from "@/lib/utils";
import { useTheme } from "./theme-provider";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";

interface DocumentViewerProps {
  open: boolean;
  document: string;
  documentName: string;
  setOpen: (open: boolean) => void;
}

const DocumentViewer = ({ open, document, documentName, setOpen }: DocumentViewerProps) => {
  const { theme } = useTheme();
  const [isGeneratingPDF, setIsGeneratingPDF] = useState<boolean>(false);
  const [actualTheme, setActualTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const updateTheme = () => {
      if (theme === "system") {
        const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
        setActualTheme(systemTheme);
      } else {
        setActualTheme(theme as "light" | "dark");
      }
    };

    updateTheme();

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    mediaQuery.addEventListener("change", updateTheme);

    return () => mediaQuery.removeEventListener("change", updateTheme);
  }, [theme]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="flex max-h-[85vh] w-screen-xl flex-col p-0">
        <DialogHeader className="flex flex-row items-center justify-between border-b px-6 py-4">
          <DialogTitle className="font-semibold text-lg">{documentName || "Document"}</DialogTitle>
        </DialogHeader>
        <div id="markdown-preview" className="flex-1 overflow-y-auto px-6 py-4" data-color-mode={actualTheme}>
          <div className="markdown-content" style={{ color: "inherit" }}>
            <MDEditor.Markdown
              source={document}
              style={{
                backgroundColor: "transparent",
                fontSize: 14,
                color: "inherit",
              }}
            />
          </div>
        </div>
        <div className="flex justify-end border-t bg-background px-6 py-4">
          <Button
            variant="default"
            disabled={isGeneratingPDF}
            onClick={async () => {
              setIsGeneratingPDF(true);
              try {
                await downloadMarkdownAsPDF(document, documentName);
              } catch {
                // Error is logged, user can retry if needed
              } finally {
                setIsGeneratingPDF(false);
              }
            }}
          >
            {isGeneratingPDF ? (
              <Loader2 className="animate-spin" />
            ) : (
              <>
                <Download /> Download PDF
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DocumentViewer;
