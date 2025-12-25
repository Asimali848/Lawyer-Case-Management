import { Camera, Mail, Trash2 } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useDeleteProfilePictureMutation, useUploadProfilePictureMutation } from "@/store/services/auth";

interface UserProfileCardProps {
  firstName: string;
  lastName: string;
  email: string;
  profilePictureUrl?: string | null;
}

const UserProfileCard = ({ firstName, lastName, email, profilePictureUrl }: UserProfileCardProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProfilePicture] = useUploadProfilePictureMutation();
  const [deleteProfilePicture] = useDeleteProfilePictureMutation();

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Please select a valid image file (JPG, PNG, GIF, or WebP)");
      return;
    }

    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append("file", file);

      await uploadProfilePicture(formData).unwrap();
      toast.success("Profile picture updated successfully!");
    } catch (error: any) {
      toast.error(error?.data?.detail || "Failed to upload profile picture");
    } finally {
      setIsUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleDeletePicture = async () => {
    if (!profilePictureUrl) {
      toast.error("No profile picture to delete");
      return;
    }

    try {
      setIsUploading(true);
      await deleteProfilePicture().unwrap();
      toast.success("Profile picture removed successfully!");
    } catch (error: any) {
      toast.error(error?.data?.detail || "Failed to delete profile picture");
    } finally {
      setIsUploading(false);
    }
  };

  const getInitials = () => {
    if (firstName && lastName) {
      return `${firstName[0]}${lastName[0]}`.toUpperCase();
    }
    return "U";
  };

  // Get thumbnail URL with ImageKit transformation
  const getThumbnailUrl = () => {
    if (!profilePictureUrl) return null;
    return `${profilePictureUrl}?tr=w-200,h-200,fo-face`;
  };

  return (
    <Card>
      <CardContent className="flex flex-col items-center pt-6">
        <div className="relative">
          <Avatar
            className="mb-4 size-24 shrink-0 cursor-pointer bg-primary/40 object-cover transition-opacity hover:opacity-80"
            onClick={handleAvatarClick}
          >
            {getThumbnailUrl() ? <AvatarImage src={getThumbnailUrl()!} alt="Profile" className="object-cover" /> : null}
            <AvatarFallback className="shrink-0 bg-primary/40 object-cover font-bold text-2xl text-white">
              {getInitials()}
            </AvatarFallback>
          </Avatar>
          <div
            className="absolute right-1 bottom-2.5 flex size-8 cursor-pointer items-center justify-center rounded-full bg-primary text-white transition-colors hover:bg-primary/90"
            onClick={handleAvatarClick}
          >
            {isUploading ? (
              <div className="size-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : (
              <Camera className="size-4 shrink-0 object-cover" />
            )}
          </div>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
          className="hidden shrink-0 object-cover"
          onChange={handleImageChange}
          disabled={isUploading}
        />
        <h2 className="mb-2 font-bold text-2xl">
          {firstName || lastName ? `${firstName} ${lastName}`.trim() : "User"}
        </h2>
        <div className="mb-4 flex items-center gap-2 text-muted-foreground">
          <Mail className="size-4 shrink-0 object-cover" />
          <span className="text-sm">{email || "No email provided"}</span>
        </div>
        {profilePictureUrl && (
          <Button variant="outline" size="sm" onClick={handleDeletePicture} disabled={isUploading} className="gap-2">
            <Trash2 className="size-4" />
            Remove Picture
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default UserProfileCard;
