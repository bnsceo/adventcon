
import { useEffect, useMemo, useState } from "react";
import Navigation from "@/components/Navigation";
import CommunityHeader from "@/components/CommunityHeader";
import PostsList from "@/components/PostsList";
import { usePosts } from "@/hooks/usePosts";
import { useToast } from "@/components/ui/use-toast";
import SearchBar from "@/components/SearchBar";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { Users, UserPlus, Bell, Mail } from "lucide-react";

const CommunityPage = () => {
  const { data: posts, isLoading, error, createPost } = usePosts();
  const { toast } = useToast();

  const { data: session } = useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      return session;
    }
  });

  const { data: profile } = useQuery({
    queryKey: ['profile', session?.user?.id],
    enabled: !!session?.user?.id,
    queryFn: async () => {
      const { data } = await supabase
        .from('profiles')
        .select()
        .eq('id', session.user.id)
        .single();
      return data;
    }
  });

  const extractHashtags = (content: string) => {
    const hashtagRegex = /#[\w]+/g;
    return content.match(hashtagRegex)?.map(tag => tag.slice(1)) || [];
  };

  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: "Failed to load posts. Please try again later.",
        variant: "destructive",
      });
    }
  }, [error, toast]);

  const handleCreatePost = async (title: string, content: string, files: File[]) => {
    try {
      const hashtags = extractHashtags(content);
      await createPost.mutateAsync({ title, content, hashtags, files });
      toast({
        title: "Success",
        description: "Your post has been published!",
      });
    } catch (err) {
      console.error("Error creating post:", err);
      toast({
        title: "Error",
        description: "Failed to create post. Please try again.",
        variant: "destructive",
      });
    }
  };

  const [searchTerm, setSearchTerm] = useState("");
  const filteredPosts = useMemo(
    () => posts?.filter(post =>
      post.title.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [],
    [posts, searchTerm]
  );

  return (
    <div className="min-h-screen bg-[#f0f2f5]">
      <Navigation />
      <div className="max-w-[1200px] mx-auto px-4 md:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-24 pb-12">
          {/* Left Sidebar */}
          <aside className="hidden lg:block lg:col-span-3">
            <div className="sticky top-24 space-y-6">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="text-center">
                  <div className="w-20 h-20 mx-auto mb-4">
                    <img 
                      src={profile?.avatar_url || "/placeholder.svg"}
                      alt={profile?.username || "Profile"} 
                      className="rounded-full w-full h-full object-cover"
                    />
                  </div>
                  <h2 className="text-lg font-semibold mb-1">{profile?.username}</h2>
                  <p className="text-sm text-muted-foreground mb-4">{profile?.church_role || "Community Member"}</p>
                </div>
                
                <div className="grid grid-cols-3 gap-4 py-4 border-y">
                  <div className="text-center">
                    <div className="text-primary font-bold">23</div>
                    <div className="text-xs text-muted-foreground">Posts</div>
                  </div>
                  <div className="text-center">
                    <div className="text-primary font-bold">142</div>
                    <div className="text-xs text-muted-foreground">Following</div>
                  </div>
                  <div className="text-center">
                    <div className="text-primary font-bold">89</div>
                    <div className="text-xs text-muted-foreground">Followers</div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="font-semibold text-primary mb-4">Your Groups</h3>
                <div className="space-y-4">
                  {['Prayer Warriors', 'Bible Study', 'Youth Ministry'].map(group => (
                    <div key={group} className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <Users className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{group}</p>
                        <p className="text-xs text-muted-foreground">Active</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-6">
            <div className="space-y-6">
              <CommunityHeader onCreatePost={handleCreatePost} />
              <SearchBar value={searchTerm} onChange={setSearchTerm} />
              {isLoading ? (
                <LoadingSpinner />
              ) : (
                <PostsList
                  posts={filteredPosts}
                  error={error}
                  isLoading={isLoading}
                />
              )}
            </div>
          </main>

          {/* Right Sidebar */}
          <aside className="hidden lg:block lg:col-span-3">
            <div className="sticky top-24 space-y-6">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="font-semibold text-primary mb-4">Trending Topics</h3>
                <div className="space-y-4">
                  {['Prayer', 'Bible Study', 'Mission', 'Health'].map((topic, index) => (
                    <div key={topic} className="text-sm">
                      <p className="font-medium text-primary">#{topic}</p>
                      <p className="text-xs text-muted-foreground">
                        {100 - index * 20} posts today
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="font-semibold text-primary mb-4">Upcoming Events</h3>
                <div className="space-y-4">
                  {['Prayer Meeting', 'Youth Sabbath', 'Bible Study'].map(event => (
                    <div key={event} className="flex items-center gap-3">
                      <div className="text-center bg-primary/10 px-3 py-1 rounded">
                        <div className="text-xs text-primary uppercase">Jun</div>
                        <div className="text-sm font-bold text-primary">
                          {Math.floor(Math.random() * 30) + 1}
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium">{event}</p>
                        <p className="text-xs text-muted-foreground">4 going</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default CommunityPage;
