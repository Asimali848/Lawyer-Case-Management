import { CheckCircle, Copy, Link2, Loader2, Share2, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  useGenerateShareLinkMutation,
  useDeactivateShareLinkMutation,
} from "@/store/services/sharing";

interface ShareCaseDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  caseId: string;
  caseName?: string;
}

const ShareCaseDialog = ({ open, setOpen, caseId, caseName }: ShareCaseDialogProps) => {
  const [copied, setCopied] = useState(false);
  const [shareLink, setShareLink] = useState<{ id: string; token: string } | null>(null);

  const [generateLink, { isLoading: isGenerating }] = useGenerateShareLinkMutation();
  const [deactivateLink, { isLoading: isDeactivating }] = useDeactivateShareLinkMutation();

  // Reset state when selected case changes
  useEffect(() => {
    setShareLink(null);
    setCopied(false);
  }, [caseId]);

  const handleGetLink = async () => {
    let result;
    try {
      const response: any = await generateLink(caseId).unwrap();
      
      // Handle cases where the backend might wrap the response
      result = response?.data || response;
      
      if (!result?.id || !result?.token) {
        throw new Error("Invalid response format from server");
      }

      setShareLink({ id: result.id, token: result.token });
    } catch (error: any) {
      toast.error(error?.data?.detail || error?.message || "Failed to generate share link");
      return;
    }

    // Auto-copy to clipboard
    try {
      const shareUrl = `${window.location.origin}/shared/${result.token}`;
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast.success("Share link generated and copied!");
      setTimeout(() => setCopied(false), 3000);
    } catch (clipboardError) {
      // If clipboard copy fails (e.g., non-HTTPS environment), just show success for generation
      toast.success("Share link generated successfully!");
    }
  };

  const handleCopy = async () => {
    if (!shareLink) return;
    const shareUrl = `${window.location.origin}/shared/${shareLink.token}`;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast.success("Link copied!");
      setTimeout(() => setCopied(false), 3000);
    } catch {
      toast.error("Failed to copy link");
    }
  };

  const handleDeactivate = async () => {
    if (!shareLink) return;
    try {
      await deactivateLink(shareLink.id).unwrap();
      setShareLink(null);
      toast.success("Share link removed");
    } catch (error: any) {
      toast.error(error?.data?.detail || "Failed to remove link");
    }
  };

  const handleClose = (value: boolean) => {
    setOpen(value);
    if (!value) {
      setCopied(false);
      // Reset share link when dialog closes so it doesn't leak or persist incorrectly
      setTimeout(() => setShareLink(null), 300);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="w-[95vw] max-w-md p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base sm:text-lg">
            <Share2 className="size-4 text-primary sm:size-5" />
            Share Case
          </DialogTitle>
          <DialogDescription className="text-xs sm:text-sm">
            {caseName ? `Share "${caseName}" with others` : "Generate a secure link to share this case"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {!shareLink ? (
            /* No link yet — show the button to generate */
            <Button
              onClick={handleGetLink}
              disabled={isGenerating}
              className="w-full bg-primary text-white hover:bg-primary/90"
              size="default"
            >
              {isGenerating ? (
                <Loader2 className="mr-2 size-4 animate-spin" />
              ) : (
                <Link2 className="mr-2 size-4" />
              )}
              Get Share Link
            </Button>
          ) : (
            /* Link exists — show it */
            <div className="space-y-3">
              <div className="flex items-center gap-2 rounded-lg border bg-muted/50 p-2.5 sm:p-3">
                <code className="min-w-0 flex-1 truncate text-[11px] text-muted-foreground sm:text-xs">
                  {`${window.location.origin}/shared/${shareLink.token.slice(0, 16)}...`}
                </code>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-8 shrink-0"
                  onClick={handleCopy}
                >
                  {copied ? (
                    <CheckCircle className="size-4 text-green-500" />
                  ) : (
                    <Copy className="size-4" />
                  )}
                </Button>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={handleCopy}
                >
                  {copied ? (
                    <CheckCircle className="mr-1.5 size-3.5 text-green-500" />
                  ) : (
                    <Copy className="mr-1.5 size-3.5" />
                  )}
                  {copied ? "Copied!" : "Copy Link"}
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleDeactivate}
                  disabled={isDeactivating}
                >
                  {isDeactivating ? (
                    <Loader2 className="mr-1.5 size-3.5 animate-spin" />
                  ) : (
                    <Trash2 className="mr-1.5 size-3.5" />
                  )}
                  Remove
                </Button>
              </div>
            </div>
          )}

          
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShareCaseDialog;
