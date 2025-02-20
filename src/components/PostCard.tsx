
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Heart, MessageSquare, Share2, User, Ban } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface Profiles {
  id: string;
  username: string;
  avatar_url: string | null;
}

interface PostCardProps {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  commentCount?: number;
  hashtags?: string[];
  attachments?: {
    url: string;
    type: string;
    name: string;
  }[];
  profiles: Profiles;
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
  const [isLiked, setIsLiked] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Handle like functionality
  const likeMutation = useMutation({
    mutationFn: async () => {
      if (isLiked) {
        const { error } = await supabase
          .from('likes')
          .delete()
          .eq('post_id', id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('likes')
          .insert([{ post_id: id }]);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      setIsLiked(!isLiked);
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update like. Please try again.",
        variant: "destructive",
      });
      console.error('Error updating like:', error);
    },
  });

  const handleLike = () => {
    likeMutation.mutate();
  };

  const handleShare = () => {
    // Create share URL
    const shareUrl = `${window.location.origin}/post/${id}`;
    
    // Use Web Share API if available
    if (navigator.share) {
      navigator.share({
        title: title,
        text: content.substring(0, 100) + '...',
        url: shareUrl,
      }).catch((error) => {
        console.error('Error sharing:', error);
        // Fallback to copying to clipboard
        copyToClipboard(shareUrl);
      });
    } else {
      // Fallback to copying to clipboard
      copyToClipboard(shareUrl);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: "Link copied!",
        description: "The post link has been copied to your clipboard.",
      });
    }).catch(() => {
      toast({
        title: "Error",
        description: "Failed to copy link. Please try again.",
        variant: "destructive",
      });
    });
  };

  // Helper to check if a URL is an image
  const isImageUrl = (url: string) => {
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
    return imageExtensions.some(ext => url.toLowerCase().endsWith(ext));
  };

  return (
    <Card className="mb-4 px-6">
      <CardHeader className="pb-3">
        <div className="flex items-center space-x-3 mb-2">
          <Link to={`/profile/${profiles.username}`}>
            <Avatar className="h-8 w-8">
              <AvatarImage src={profiles.avatar_url || undefined} />
              <AvatarFallback>
                <User className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
          </Link>
          <div>
            <Link to={`/profile/${profiles.username}`} className="text-sm font-medium hover:underline">
              {profiles.username}
            </Link>
            <p className="text-xs text-muted-foreground">
              {format(new Date(createdAt), 'MMMM d, yyyy')}
            </p>
          </div>
        </div>
        <h3 className="text-xl font-semibold">{title}</h3>
      </CardHeader>
      <CardContent className="py-0">
        <p className="text-muted-foreground whitespace-pre-wrap">{content}</p>
        
        {attachments.length > 0 && (
          <div className="mt-4 flex flex-col items-center gap-4">
            {attachments.map((attachment, index) => (
              isImageUrl(attachment.url) ? (
                <img
                  key={index}
                  src={attachment.url}
                  alt={attachment.name}
                  loading="lazy"
                  className="rounded-md max-h-[512px] w-auto object-contain mx-auto"
                />
              ) : (
                <a
                  key={index}
                  href={attachment.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-primary hover:underline"
                >
                  {attachment.name}
                </a>
              )
            ))}
          </div>
        )}

        {hashtags.length > 0 && (
          <div className="mt-3">
            {hashtags.map(tag => (
              <span
                key={tag}
                className="inline-block bg-secondary text-secondary-foreground px-2 py-1 mr-2 text-xs rounded-full"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between items-center mt-4">
        <div className="flex items-center space-x-4 text-muted-foreground">
          <Button
            variant="ghost"
            size="sm"
            className={`hover:text-primary transition-colors duration-200 ${isLiked ? 'text-primary' : ''}`}
            onClick={handleLike}
          >
            <Heart className={`h-4 w-4 mr-1 ${isLiked ? 'fill-current' : ''}`} />
            <span>{likeCount} Likes</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="hover:text-primary transition-colors duration-200"
          >
            <MessageSquare className="h-4 w-4 mr-1" />
            <span>{commentCount} Comments</span>
          </Button>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="text-muted-foreground hover:text-primary transition-colors duration-200"
          onClick={handleShare}
        >
          <Share2 className="h-4 w-4 mr-1" />
          Share
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PostCard;
