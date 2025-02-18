
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ProfileForm } from "@/components/profile/ProfileForm";
import type { Profile } from "@/types/profile";

const UserProfilePage = () => {
  const { username } = useParams();
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [formData, setFormData] = useState<Partial<Profile>>({});

  const { data: session } = useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      return session;
    },
  });

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

  const isOwnProfile = session?.user.id === profile?.id;

  useEffect(() => {
    if (profile && !isEditing) {
      setFormData(profile);
    }
  }, [profile, isEditing]);

  const updateProfile = useMutation({
    mutationFn: async (data: Partial<Profile>) => {
      if (!session?.user.id) throw new Error('Not authenticated');

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
            <h1 className="text-2xl font-bold">
              {isOwnProfile ? 'Your Profile' : `${profile.username}'s Profile`}
            </h1>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <ProfileHeader
                profile={profile}
                isOwnProfile={isOwnProfile}
                isEditing={isEditing}
                avatarFile={avatarFile}
                onAvatarChange={handleFileChange}
              />
              <ProfileForm
                profile={profile}
                isEditing={isEditing}
                isOwnProfile={isOwnProfile}
                formData={formData}
                setFormData={setFormData}
                onSubmit={handleSubmit}
                setIsEditing={setIsEditing}
                isPending={updateProfile.isPending}
              />
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default UserProfilePage;
