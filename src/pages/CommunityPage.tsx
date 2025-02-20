import { useEffect, useMemo, useState } from "react";
import Navigation from "@/components/Navigation";
import CommunityHeader from "@/components/CommunityHeader";
import PostsList from "@/components/PostsList";
import { usePosts } from "@/hooks/usePosts";
import { useToast } from "@/components/ui/use-toast";
import SearchBar from "@/components/SearchBar";
import LoadingSpinner from "@/components/LoadingSpinner";
const CommunityPage = () => {
  const {
    data: posts,
    isLoading,
    error,
    createPost
  } = usePosts();
  const {
    toast
  } = useToast();

  // Memoize hashtag extraction if posts are large or frequently updated
  const extractHashtags = (content: string) => {
    const hashtagRegex = /#[\w]+/g;
    return content.match(hashtagRegex)?.map(tag => tag.slice(1)) || [];
  };
  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: "Failed to load posts. Please try again later.",
        variant: "destructive"
      });
    }
  }, [error, toast]);
  const handleCreatePost = async (title: string, content: string, files: File[]) => {
    try {
      const hashtags = extractHashtags(content);
      await createPost.mutateAsync({
        title,
        content,
        hashtags,
        files
      });
      toast({
        title: "Success",
        description: "Your post has been published!"
      });
    } catch (err) {
      console.error("Error creating post:", err);
      toast({
        title: "Error",
        description: "Failed to create post. Please try again.",
        variant: "destructive"
      });
    }
  };
  const [searchTerm, setSearchTerm] = useState("");
  const filteredPosts = useMemo(() => posts?.filter(post => post.title.toLowerCase().includes(searchTerm.toLowerCase())) || [], [posts, searchTerm]);
  return <div className="min-h-screen bg-[#F1F0FB]">
      <Navigation />
      <div className="container mx-auto lg:px-8 px-[129px]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-24 pb-12">
          {/* Left Sidebar - Can be used for user profile or categories */}
          <aside className="hidden lg:block lg:col-span-3">
            <div className="sticky top-24 space-y-6">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="font-semibold text-lg mb-4">Community Guidelines</h3>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  <li>• Share uplifting content</li>
                  <li>• Be respectful and kind</li>
                  <li>• Support fellow believers</li>
                </ul>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-6">
            <div className="space-y-6">
              <CommunityHeader onCreatePost={handleCreatePost} />
              <SearchBar value={searchTerm} onChange={setSearchTerm} />
              {isLoading ? <LoadingSpinner /> : <PostsList posts={filteredPosts} error={error} isLoading={isLoading} />}
            </div>
          </main>

          {/* Right Sidebar - Trending topics or announcements */}
          <aside className="hidden lg:block lg:col-span-3">
            <div className="sticky top-24 space-y-6">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="font-semibold text-lg mb-4">Trending Topics</h3>
                <div className="space-y-3">
                  {['Prayer', 'Bible Study', 'Mission', 'Health'].map(topic => <div key={topic} className="text-sm">
                      <p className="font-medium text-primary">{`#${topic}`}</p>
                      <p className="text-muted-foreground text-xs">Growing discussion</p>
                    </div>)}
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>;
};
export default CommunityPage;