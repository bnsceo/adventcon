
import Navigation from "@/components/Navigation";
import CommunityHeader from "@/components/CommunityHeader";
import PostsList from "@/components/PostsList";
import { usePosts } from "@/hooks/usePosts";

const CommunityPage = () => {
  const { posts, isLoading, error, createPost } = usePosts();

  const handleCreatePost = async (title: string, content: string, files: File[]) => {
    const hashtagRegex = /#[\w]+/g;
    const hashtags = content.match(hashtagRegex)?.map(tag => tag.slice(1)) || [];
    
    await createPost.mutateAsync({ title, content, hashtags, files });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 pt-24 pb-12">
        <CommunityHeader onCreatePost={handleCreatePost} />
        <PostsList posts={posts} isLoading={isLoading} error={error} />
      </main>
    </div>
  );
};

export default CommunityPage;
