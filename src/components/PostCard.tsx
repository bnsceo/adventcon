
import { useState } from "react";
import { format } from "date-fns";
import { MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import CommentList from "./CommentList";

interface PostCardProps {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  commentCount?: number;
}

const PostCard = ({ id, title, content, createdAt, commentCount = 0 }: PostCardProps) => {
  const [showComments, setShowComments] = useState(false);

  return (
    <Card className="mb-4">
      <CardHeader className="pb-3">
        <h3 className="text-xl font-semibold">{title}</h3>
        <p className="text-sm text-muted-foreground">
          {format(new Date(createdAt), 'MMMM d, yyyy')}
        </p>
      </CardHeader>
      <CardContent>
        <p className="text-base text-card-foreground">{content}</p>
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
