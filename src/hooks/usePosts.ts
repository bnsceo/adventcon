
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

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
  profiles: {
    id: string;
    username: string;
    avatar_url: string | null;
  };
}

export const usePosts = () => {
  return useQuery({
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

      if (error) throw error;
      return data as Post[];
    },
  });
};
