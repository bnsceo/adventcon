
import { useEffect, useMemo, useState } from "react";
import { Bell, BookOpen, Home, MessageCircle, Search, Share2, ThumbsUp, User, Users } from "lucide-react";
import { usePosts } from "@/hooks/usePosts";
import { useToast } from "@/components/ui/use-toast";
import LoadingSpinner from "@/components/LoadingSpinner";
import PostsList from "@/components/PostsList";
import CommunityHeader from "@/components/CommunityHeader";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const UserProfilePage = () => {
  const { data: posts, isLoading: postsLoading, error, createPost } = usePosts();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");

  const { data: session } = useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      return session;
    }
  });

  const { data: profile, isLoading: profileLoading } = useQuery({
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

  const isLoading = postsLoading || profileLoading;

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

  const filteredPosts = useMemo(
    () => posts?.filter(post =>
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.content.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [],
    [posts, searchTerm]
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-indigo-700 text-white fixed w-full z-10 shadow-md">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-xl font-bold">Adventist.com</h1>
            <div className="flex items-center gap-4">
              <button className="p-2 rounded-full hover:bg-indigo-600 transition-colors">
                <Bell className="w-5 h-5" />
              </button>
              <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-200">
                <User className="w-full h-full p-1.5 text-slate-600" />
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 pt-20 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Left Sidebar */}
          <aside className="hidden md:block md:col-span-1 space-y-4">
            <div className="bg-white rounded-lg shadow-sm p-4 sticky top-20">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search community..."
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="mt-6 border-t border-slate-200 pt-4">
                <h3 className="font-semibold text-sm mb-3">Community Stats</h3>
                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Active Members</span>
                    <span className="font-medium text-indigo-600">2.4K</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Weekly Posts</span>
                    <span className="font-medium text-indigo-600">356</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Bible Studies</span>
                    <span className="font-medium text-indigo-600">89</span>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Feed */}
          <div className="md:col-span-3 space-y-4">
            <CommunityHeader onCreatePost={handleCreatePost} />
            
            {isLoading ? (
              <div className="flex justify-center py-12">
                <LoadingSpinner className="text-indigo-600" />
              </div>
            ) : (
              <PostsList posts={filteredPosts} />
            )}
          </div>
        </div>
      </main>

      {/* Mobile Navigation */}
      <nav className="md:hidden fixed bottom-0 w-full bg-white border-t border-slate-200 shadow-lg z-10">
        <div className="flex justify-around items-center h-16">
          <button className="flex flex-col items-center text-indigo-600">
            <Home className="w-6 h-6" />
            <span className="text-xs mt-1">Home</span>
          </button>
          <button className="flex flex-col items-center text-slate-600">
            <Search className="w-6 h-6" />
            <span className="text-xs mt-1">Search</span>
          </button>
          <button className="flex flex-col items-center text-slate-600">
            <Users className="w-6 h-6" />
            <span className="text-xs mt-1">Community</span>
          </button>
          <button className="flex flex-col items-center text-slate-600">
            <BookOpen className="w-6 h-6" />
            <span className="text-xs mt-1">Studies</span>
          </button>
        </div>
      </nav>
    </div>
  );
};

export default UserProfilePage;
