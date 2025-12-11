import { useRef, useState } from "react";
import { Mail, Camera } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";

interface UserProfileCardProps {
  firstName: string;
  lastName: string;
  email: string;
}

const UserProfileCard = ({ firstName, lastName, email }: UserProfileCardProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }
      if (!file.type.startsWith("image/")) {
        toast.error("Please select a valid image file");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarUrl(reader.result as string);
        toast.success("Image updated successfully!");
      };
      reader.readAsDataURL(file);
    }
  };

  const getInitials = () => {
    if (firstName && lastName) {
      return `${firstName[0]}${lastName[0]}`.toUpperCase();
    }
    return "U";
  };

  return (
    <Card>
      <CardContent className="flex flex-col items-center pt-6">
        <div className="relative">
          <Avatar
            className="mb-4 size-24 cursor-pointer bg-primary/40 transition-opacity hover:opacity-80 shrink-0 object-cover"
            onClick={handleAvatarClick}
          >
            {avatarUrl ? <AvatarImage src={avatarUrl} alt="Profile" /> : null}
            <AvatarFallback className="bg-primary/40 text-2xl font-bold text-white shrink-0 object-cover">
              {getInitials()}
            </AvatarFallback>
          </Avatar>
          <div className="absolute bottom-2.5 right-1 flex size-8 items-center justify-center rounded-full bg-primary text-white cursor-pointer"  onClick={handleAvatarClick}>
            <Camera className="size-4 shrink-0 object-cover" />
          </div>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden shrink-0 object-cover"
          onChange={handleImageChange}
        />
        <h2 className="mb-2 text-2xl font-bold">
          {firstName || lastName ? `${firstName} ${lastName}`.trim() : "User"}
        </h2>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Mail className="size-4 shrink-0 object-cover" />
          <span className="text-sm">{email || "No email provided"}</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserProfileCard;

