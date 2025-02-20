
import { useEffect, useMemo, useState } from "react";
import Navigation from "@/components/Navigation";
import CommunityHeader from "@/components/CommunityHeader";
import PostsList from "@/components/PostsList";
import { usePosts } from "@/hooks/usePosts";
import { useToast } from "@/components/ui/use-toast";
import SearchBar from "@/components/SearchBar";
import LoadingSpinner from "@/components/LoadingSpinner";

const CommunityPage = () => {
  const { data: posts, isLoading, error, createPost } = usePosts();
  const { toast } = useToast();

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
    () =>
      posts?.filter(post =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase())
      ) || [],
    [posts, searchTerm]
  );

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 pt-24 pb-12">
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
      </main>
    </div>
  );
};

export default CommunityPage;
