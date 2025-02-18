
import { useState } from "react";
import { format } from "date-fns";
import { MessageSquare, Tag, FileText, Image, Video, User, Heart, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import CommentList from "./CommentList";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface Attachment {
  url: string;
  type: string;
  name: string;
}

interface PostCardProps {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  commentCount?: number;
  hashtags?: string[];
  attachments?: Attachment[];
  profiles: {
    username: string;
    avatar_url: string | null;
  };
  likeCount?: number;
}

const PostCard = ({ 
  id, 
  title, 
  content, 
  createdAt, 
  commentCount = 0,
  hashtags = [],
  attachments = [],
  profiles,
  likeCount = 0
}: PostCardProps) => {
  const [showComments, setShowComments] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Query to check if the current user has liked this post
  const { data: isLiked } = useQuery({
    queryKey: ['likes', id],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;

      const { data } = await supabase
        .from('likes')
        .select('id')
        .eq('post_id', id)
        .eq('user_id', user.id)
        .maybeSingle();

      return !!data;
    }
  });

  // Mutation for toggling like
  const toggleLike = useMutation({
    mutationFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      if (isLiked) {
        await supabase
          .from('likes')
          .delete()
          .eq('post_id', id)
          .eq('user_id', user.id);
      } else {
        await supabase
          .from('likes')
          .insert([{ post_id: id, user_id: user.id }]);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      queryClient.invalidateQueries({ queryKey: ['likes', id] });
    }
  });

  const handleLike = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to like posts",
        variant: "destructive"
      });
      return;
    }
    
    toggleLike.mutate();
  };

  const handleShare = async () => {
    try {
      await navigator.share({
        title,
        text: content,
        url: window.location.href
      });
    } catch (error) {
      // Fallback for browsers that don't support native sharing
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link copied!",
        description: "The post URL has been copied to your clipboard"
      });
    }
  };

  const getAttachmentIcon = (type: string) => {
    if (type.startsWith('image/')) return <Image className="h-4 w-4" />;
    if (type.startsWith('video/')) return <Video className="h-4 w-4" />;
    return <FileText className="h-4 w-4" />;
  };

  return (
    <Card className="mb-4">
      <CardHeader className="pb-3">
        <div className="flex items-center space-x-3 mb-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={profiles.avatar_url || undefined} />
            <AvatarFallback>
              <User className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium">{profiles.username}</p>
            <p className="text-xs text-muted-foreground">
              {format(new Date(createdAt), 'MMMM d, yyyy')}
            </p>
          </div>
        </div>
        <h3 className="text-xl font-semibold">{title}</h3>
      </CardHeader>
      <CardContent>
        <p className="text-base text-card-foreground mb-4">{content}</p>
        
        {attachments.length > 0 && (
          <div className="space-y-4 mb-4">
            {attachments.map((attachment, index) => (
              <div key={index}>
                {attachment.type.startsWith('image/') ? (
                  <img 
                    src={attachment.url} 
                    alt={attachment.name}
                    className="rounded-lg max-h-96 w-full object-cover"
                  />
                ) : (
                  <a
                    href={attachment.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-primary hover:underline"
                  >
                    {getAttachmentIcon(attachment.type)}
                    {attachment.name}
                  </a>
                )}
              </div>
            ))}
          </div>
        )}
        
        {hashtags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {hashtags.map((tag) => (
              <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                <Tag className="h-3 w-3" />
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex flex-col items-stretch pt-3">
        <div className="flex items-center gap-4 mb-4">
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center gap-2"
            onClick={handleLike}
          >
            <Heart 
              className={`w-4 h-4 ${isLiked ? 'fill-primary text-primary' : ''}`} 
            />
            {likeCount} Likes
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center gap-2"
            onClick={() => setShowComments(!showComments)}
          >
            <MessageSquare className="w-4 h-4" />
            {commentCount} Comments
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center gap-2"
            onClick={handleShare}
          >
            <Share2 className="w-4 h-4" />
            Share
          </Button>
        </div>
        {showComments && (
          <CommentList postId={id} />
        )}
      </CardFooter>
    </Card>
  );
};

export default PostCard;
