
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Profile } from "@/types/profile";

interface ProfileFormProps {
  profile: Profile;
  isEditing: boolean;
  isOwnProfile: boolean;
  formData: Partial<Profile>;
  setFormData: (data: Partial<Profile>) => void;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  setIsEditing: (value: boolean) => void;
  isPending: boolean;
}

export const ProfileForm = ({
  profile,
  isEditing,
  isOwnProfile,
  formData,
  setFormData,
  onSubmit,
  setIsEditing,
  isPending,
}: ProfileFormProps) => {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Full Name</label>
          {isEditing ? (
            <Input
              value={formData.full_name || ''}
              onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
            />
          ) : (
            <p className="py-2">{profile.full_name || 'Not specified'}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Username</label>
          <p className="py-2">{profile.username}</p>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Location</label>
          {isEditing ? (
            <Input
              value={formData.location || ''}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            />
          ) : (
            <p className="py-2">{profile.location || 'Not specified'}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Church Name</label>
          {isEditing ? (
            <Input
              value={formData.church_name || ''}
              onChange={(e) => setFormData({ ...formData, church_name: e.target.value })}
            />
          ) : (
            <p className="py-2">{profile.church_name || 'Not specified'}</p>
          )}
        </div>

        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-medium">Favorite Bible Verse</label>
          {isEditing ? (
            <Input
              value={formData.favorite_bible_verse || ''}
              onChange={(e) => setFormData({ ...formData, favorite_bible_verse: e.target.value })}
            />
          ) : (
            <p className="py-2">{profile.favorite_bible_verse || 'Not specified'}</p>
          )}
        </div>

        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-medium">Bio</label>
          {isEditing ? (
            <Textarea
              value={formData.bio || ''}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              className="min-h-[100px]"
            />
          ) : (
            <p className="py-2">{profile.bio || 'No bio provided'}</p>
          )}
        </div>

        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-medium">Website</label>
          {isEditing ? (
            <Input
              type="url"
              value={formData.website_url || ''}
              onChange={(e) => setFormData({ ...formData, website_url: e.target.value })}
            />
          ) : (
            <p className="py-2">
              {profile.website_url ? (
                <a 
                  href={profile.website_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  {profile.website_url}
                </a>
              ) : (
                'Not specified'
              )}
            </p>
          )}
        </div>
      </div>

      {isOwnProfile && (
        <div className="flex justify-end space-x-4">
          {isEditing ? (
            <>
              <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Saving..." : "Save Changes"}
              </Button>
            </>
          ) : (
            <Button type="button" onClick={() => setIsEditing(true)}>
              Edit Profile
            </Button>
          )}
        </div>
      )}
    </form>
  );
};
