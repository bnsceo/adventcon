
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";

type Post = {
  id: string;
  title: string;
  content: string;
  created_at: string;
  user_id: string;
  comment_count: number;
  hashtags: string[];
  attachment_urls: {
    url: string;
    type: string;
    name: string;
  }[];
  profiles: {
    username: string;
    avatar_url: string | null;
  };
};

export const usePosts = () => {
  const queryClient = useQueryClient();

  const { data: posts, isLoading, error } = useQuery({
    queryKey: ['posts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          comment_count:comments(count),
          profiles:profiles!user_id(username, avatar_url)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      if (!data) return [];
      
      return data.map(post => {
        const postData = post as any; // temporary type assertion to handle the join
        return {
          ...post,
          comment_count: postData.comment_count[0].count,
          attachment_urls: postData.attachment_urls || [],
          hashtags: postData.hashtags || [],
          profiles: {
            username: postData.profiles?.username || 'Unknown',
            avatar_url: postData.profiles?.avatar_url
          }
        } as Post;
      });
    },
  });

  const createPost = useMutation({
    mutationFn: async ({ 
      title, 
      content,
      hashtags,
      files 
    }: { 
      title: string; 
      content: string;
      hashtags?: string[];
      files: File[];
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const attachmentUrls = await Promise.all(
        files.map(async (file) => {
          const fileExt = file.name.split('.').pop();
          const fileName = `${crypto.randomUUID()}.${fileExt}`;
          const filePath = `${user.id}/${fileName}`;

          const { error: uploadError } = await supabase.storage
            .from('post_attachments')
            .upload(filePath, file);

          if (uploadError) throw uploadError;

          const { data: { publicUrl } } = supabase.storage
            .from('post_attachments')
            .getPublicUrl(filePath);

          return {
            url: publicUrl,
            type: file.type,
            name: file.name
          };
        })
      );

      const { error } = await supabase
        .from('posts')
        .insert([{ 
          title, 
          content, 
          user_id: user.id,
          hashtags: hashtags || [],
          attachment_urls: attachmentUrls
        }]);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });

  return {
    posts,
    isLoading,
    error,
    createPost
  };
};

export type { Post };
