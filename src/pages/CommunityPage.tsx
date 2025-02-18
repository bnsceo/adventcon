import { useEffect } from "react";
import Navigation from "@/components/Navigation";
import CommunityHeader from "@/components/CommunityHeader";
import PostsList from "@/components/PostsList";
import { usePosts } from "@/hooks/usePosts";
import { useToast } from "@/components/ui/use-toast";

const CommunityPage = () => {
  const { data: posts, isLoading, error, createPost } = usePosts();
  const { toast } = useToast();

  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: "Failed to load posts. Please try again later.",
        variant: "destructive",
      });
    }
  }, [error, toast]);

  const handleCreatePost = async (title, content, files) => {
    try {
      const hashtags = extractHashtags(content); // Extract hashtags using a dedicated function

      await createPost.mutateAsync({ title, content, hashtags, files });

      toast({
        title: "Success",
        description: "Your post has been published!",
      });
    } catch (err) {
      console.error("Error creating post:", err); // Log the error for debugging
      toast({
        title: "Error",
        description: "Failed to create post. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Dedicated function for hashtag extraction (Improves readability and testability)
  const extractHashtags = (content) => {
    const hashtagRegex = /#[\w]+/g;
    return content.match(hashtagRegex)?.map(tag => tag.slice(1)) || [];
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="container mx-auto px-4 pt-24 pb-12">
        <CommunityHeader onCreatePost={handleCreatePost} isLoading={createPost.isLoading} /> {/* Pass loading state */}
        <PostsList posts={posts} isLoading={isLoading} error={error} />
      </main>
    </div>
  );
};

export default CommunityPage;
