
import { useState } from "react";
import { format } from "date-fns";
import { MessageSquare, Tag, FileText, Image, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import CommentList from "./CommentList";

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
}

const PostCard = ({ 
  id, 
  title, 
  content, 
  createdAt, 
  commentCount = 0,
  hashtags = [],
  attachments = []
}: PostCardProps) => {
  const [showComments, setShowComments] = useState(false);

  const getAttachmentIcon = (type: string) => {
    if (type.startsWith('image/')) return <Image className="h-4 w-4" />;
    if (type.startsWith('video/')) return <Video className="h-4 w-4" />;
    return <FileText className="h-4 w-4" />;
  };

  return (
    <Card className="mb-4">
      <CardHeader className="pb-3">
        <h3 className="text-xl font-semibold">{title}</h3>
        <p className="text-sm text-muted-foreground">
          {format(new Date(createdAt), 'MMMM d, yyyy')}
        </p>
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
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center gap-2 self-start"
          onClick={() => setShowComments(!showComments)}
        >
          <MessageSquare className="w-4 h-4" />
          {commentCount} Comments
        </Button>
        {showComments && (
          <CommentList postId={id} />
        )}
      </CardFooter>
    </Card>
  );
};

export default PostCard;
