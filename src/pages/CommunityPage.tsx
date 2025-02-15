
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Navigation from "@/components/Navigation";
import PostCard from "@/components/PostCard";
import CreatePostDialog from "@/components/CreatePostDialog";
import { Users } from "lucide-react";

interface Post {
  id: string;
  title: string;
  content: string;
  created_at: string;
  user_id: string;
  comment_count: number;
  hashtags: string[];
}

const CommunityPage = () => {
  const queryClient = useQueryClient();

  const { data: posts, isLoading, error } = useQuery({
    queryKey: ['posts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          comment_count:comments(count)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      return data.map(post => ({
        ...post,
        comment_count: post.comment_count[0].count
      })) as Post[];
    },
  });

  const createPost = useMutation({
    mutationFn: async ({ 
      title, 
      content,
      hashtags 
    }: { 
      title: string; 
      content: string;
      hashtags?: string[];
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('posts')
        .insert([{ 
          title, 
          content, 
          user_id: user.id,
          hashtags: hashtags || []
        }]);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });

  const handleCreatePost = async (title: string, content: string) => {
    // Extract hashtags from content
    const hashtagRegex = /#[\w]+/g;
    const hashtags = content.match(hashtagRegex)?.map(tag => tag.slice(1)) || [];
    
    await createPost.mutateAsync({ title, content, hashtags });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 pt-24 pb-12">
        <section className="max-w-4xl mx-auto text-center mb-12 animate-fade-in">
          <div className="inline-block p-2 bg-primary/10 rounded-full mb-4">
            <Users className="w-6 h-6 text-primary" />
          </div>
          <h1 className="text-4xl font-bold mb-4">
            Community
          </h1>
          <p className="text-lg text-muted-foreground mb-8">
            Share your faith journey and connect with fellow believers
          </p>
          <CreatePostDialog onCreatePost={handleCreatePost} />
        </section>

        {isLoading && (
          <div className="max-w-2xl mx-auto text-center text-muted-foreground">
            Loading posts...
          </div>
        )}

        {error && (
          <div className="max-w-2xl mx-auto text-center text-red-500">
            Error loading posts. Please try again later.
          </div>
        )}

        <section className="max-w-2xl mx-auto">
          {posts?.map((post) => (
            <PostCard
              key={post.id}
              id={post.id}
              title={post.title}
              content={post.content}
              createdAt={post.created_at}
              commentCount={post.comment_count}
              hashtags={post.hashtags}
            />
          ))}
        </section>
      </main>
    </div>
  );
};

export default CommunityPage;
