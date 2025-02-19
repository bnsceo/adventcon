
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Json } from "@/integrations/supabase/types";

export interface Post {
  id: string;
  title: string;
  content: string;
  created_at: string;
  user_id: string;
  attachment_urls: {
    url: string;
    type: string;
    name: string;
  }[];
  hashtags: string[];
  like_count: number;
  comment_count: number;
  profiles: {
    id: string;
    username: string;
    avatar_url: string | null;
  };
}

interface AttachmentUrl {
  url: string;
  type: string;
  name: string;
}

export const usePosts = () => {
  const queryClient = useQueryClient();

  const postsQuery = useQuery({
    queryKey: ['posts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          profiles (
            id,
            username,
            avatar_url
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching posts:', error);
        throw error;
      }
      
      return (data as any[]).map(post => ({
        ...post,
        attachment_urls: Array.isArray(post.attachment_urls) 
          ? post.attachment_urls.map((url: any) => ({
              url: url.url || '',
              type: url.type || '',
              name: url.name || ''
            }))
          : [],
        hashtags: Array.isArray(post.hashtags) ? post.hashtags : [],
        comment_count: post.comment_count || 0,
        like_count: post.like_count || 0
      })) as Post[];
    },
  });

  const createPost = useMutation({
    mutationFn: async ({ title, content, hashtags, files }: { 
      title: string; 
      content: string; 
      hashtags: string[];
      files: File[];
    }) => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Not authenticated');

      console.log('Creating post with:', { title, content, hashtags, files });

      // Upload files if any
      const attachment_urls: AttachmentUrl[] = [];
      for (const file of files) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `posts/${fileName}`;

        console.log('Uploading file:', filePath);

        const { error: uploadError } = await supabase.storage
          .from('attachments')
          .upload(filePath, file);

        if (uploadError) {
          console.error('File upload error:', uploadError);
          throw uploadError;
        }

        const { data: { publicUrl } } = supabase.storage
          .from('attachments')
          .getPublicUrl(filePath);

        attachment_urls.push({
          url: publicUrl,
          type: file.type,
          name: file.name
        });
      }

      console.log('Files uploaded, creating post...');

      // Create post with initial values
      const postData = {
        title,
        content,
        hashtags,
        attachment_urls: attachment_urls as unknown as Json,
        user_id: session.user.id,
        like_count: 0
      };

      const { data, error } = await supabase
        .from('posts')
        .insert([postData])
        .select(`
          *,
          profiles (
            id,
            username,
            avatar_url
          )
        `)
        .single();

      if (error) {
        console.error('Post creation error:', error);
        throw error;
      }

      console.log('Post created successfully:', data);
      
      // Transform the data to match the Post interface
      const transformedData: Post = {
        ...data,
        attachment_urls: Array.isArray(data.attachment_urls)
          ? data.attachment_urls.map((url: any) => ({
              url: url.url || '',
              type: url.type || '',
              name: url.name || ''
            }))
          : [],
        hashtags: Array.isArray(data.hashtags) ? data.hashtags : [],
        comment_count: 0,
        like_count: data.like_count || 0,
        profiles: {
          id: data.profiles.id,
          username: data.profiles.username,
          avatar_url: data.profiles.avatar_url
        }
      };

      return transformedData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });

  return {
    ...postsQuery,
    createPost
  };
};
