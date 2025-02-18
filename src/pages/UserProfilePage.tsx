
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Loader2, Upload, User } from "lucide-react";

interface Profile {
  id: string;
  username: string;
  full_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  location: string | null;
  church_name: string | null;
  ministry_roles: string[] | null;
  favorite_bible_verse: string | null;
  website_url: string | null;
}

const UserProfilePage = () => {
  const { username } = useParams(); // Get username from URL
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [formData, setFormData] = useState<Partial<Profile>>({});

  // Check if user is authenticated and get session
  const { data: session } = useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      return session;
    },
  });

  // Fetch profile data either by username or current user
  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile', username || session?.user.id],
    enabled: !!(username || session?.user.id),
    queryFn: async () => {
      let query = supabase
        .from('profiles')
        .select()
        
      if (username) {
        query = query.eq('username', username);
      } else if (session?.user.id) {
        query = query.eq('id', session.user.id);
      } else {
        throw new Error('No username or session provided');
      }

      const { data, error } = await query.maybeSingle();
      
      if (error) throw error;
      if (!data) {
        if (username) {
          navigate('/404');
          return null;
        }
        // If no profile exists for current user, create one
        if (session?.user.id) {
          const newProfile = {
            id: session.user.id,
            username: session.user.email?.split('@')[0] || 'user',
          };

          const { data: createdProfile, error: createError } = await supabase
            .from('profiles')
            .insert([newProfile])
            .select()
            .maybeSingle();

          if (createError) throw createError;
          return createdProfile;
        }
      }
      return data;
    },
  });

  // Check if the current user is viewing their own profile
  const isOwnProfile = session?.user.id === profile?.id;

  useEffect(() => {
    if (profile && !isEditing) {
      setFormData(profile);
    }
  }, [profile, isEditing]);

  const updateProfile = useMutation({
    mutationFn: async (data: Partial<Profile>) => {
      if (!session?.user.id) throw new Error('Not authenticated');

      // Handle avatar upload if there's a new file
      let avatarUrl = data.avatar_url;
      if (avatarFile) {
        const fileExt = avatarFile.name.split('.').pop();
        const filePath = `${session.user.id}/${Date.now()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(filePath, avatarFile);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('avatars')
          .getPublicUrl(filePath);

        avatarUrl = publicUrl;
      }

      const { error } = await supabase
        .from('profiles')
        .update({ ...data, avatar_url: avatarUrl })
        .eq('id', session.user.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      setIsEditing(false);
      toast({
        title: "Success",
        description: "Your profile has been updated.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
      console.error('Profile update error:', error);
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateProfile.mutateAsync(formData);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAvatarFile(e.target.files[0]);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="container mx-auto px-4 pt-24">
          <div className="flex justify-center items-center">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        </main>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="container mx-auto px-4 pt-24">
          <div className="text-center">
            <h1 className="text-2xl font-bold">Profile not found</h1>
            <p className="text-muted-foreground mt-2">The requested profile could not be found.</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 pt-24 pb-12">
        <Card className="max-w-2xl mx-auto">
          <CardHeader className="text-center">
            <h1 className="text-2xl font-bold">{isOwnProfile ? 'Your Profile' : `${profile.username}'s Profile`}</h1>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
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
                      onChange={handleFileChange}
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
                      <Button type="submit" disabled={updateProfile.isPending}>
                        {updateProfile.isPending ? "Saving..." : "Save Changes"}
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
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default UserProfilePage;
