
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { User, Upload } from "lucide-react";
import { Profile } from "@/types/profile";

interface ProfileHeaderProps {
  profile: Profile;
  isOwnProfile: boolean;
  isEditing: boolean;
  avatarFile: File | null;
  onAvatarChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const ProfileHeader = ({
  profile,
  isOwnProfile,
  isEditing,
  avatarFile,
  onAvatarChange,
}: ProfileHeaderProps) => {
  return (
    <div className="flex flex-col items-center space-y-4">
      <Avatar className="h-24 w-24">
        <AvatarImage src={avatarFile ? URL.createObjectURL(avatarFile) : profile.avatar_url || ''} />
        <AvatarFallback>
          <User className="h-12 w-12 text-muted-foreground" />
        </AvatarFallback>
      </Avatar>
      {isEditing && isOwnProfile && (
        <div className="flex items-center space-x-2">
          <Input
            type="file"
            accept="image/*"
            onChange={onAvatarChange}
            className="hidden"
            id="avatar-upload"
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => document.getElementById('avatar-upload')?.click()}
          >
            <Upload className="h-4 w-4 mr-2" />
            Upload Avatar
          </Button>
        </div>
      )}
    </div>
  );
};
