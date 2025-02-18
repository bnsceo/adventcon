import React from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Heart, MessageSquare, Share2, User } from 'lucide-react';
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
  // Placeholder for like functionality
  const handleLike = () => {
    alert('Like functionality not implemented yet.');
  };

  // Placeholder for share functionality
  const handleShare = () => {
    alert('Share functionality not implemented yet.');
  };
  return <Card className="mb-4">
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
      <CardContent className="py-4">
        <p className="text-sm text-muted-foreground">{content}</p>
        {hashtags.length > 0 && <div className="mt-3">
            {hashtags.map(tag => <span key={tag} className="inline-block bg-secondary text-secondary-foreground px-2 py-1 mr-2 text-xs rounded-full">
                {tag}
              </span>)}
          </div>}
        {attachments.length > 0 && <div className="mt-4 space-y-2">
            {attachments.map(attachment => <a key={attachment.url} href={attachment.url} target="_blank" rel="noopener noreferrer" className="block text-primary hover:underline">
                {attachment.name}
              </a>)}
          </div>}
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <div className="flex items-center space-x-4 text-muted-foreground">
          <button onClick={handleLike} className="hover:text-primary transition-colors duration-200">
            <Heart className="h-4 w-4 mr-1 inline-block" />
            <span>{likeCount} Likes</span>
          </button>
          <button className="hover:text-primary transition-colors duration-200">
            <MessageSquare className="h-4 w-4 mr-1 inline-block" />
            <span className="">{commentCount} Comments</span>
          </button>
        </div>
        <button onClick={handleShare} className="text-muted-foreground hover:text-primary transition-colors duration-200">
          <Share2 className="h-4 w-4 mr-1 inline-block" />
          Share
        </button>
      </CardFooter>
    </Card>;
};
export default PostCard;