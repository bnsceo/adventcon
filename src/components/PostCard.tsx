
import { format } from "date-fns";
import { MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";

interface PostCardProps {
  title: string;
  content: string;
  createdAt: string;
  commentCount?: number;
  onCommentClick?: () => void;
}

const PostCard = ({ title, content, createdAt, commentCount = 0, onCommentClick }: PostCardProps) => {
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
      <CardFooter className="flex justify-between items-center pt-3">
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center gap-2"
          onClick={onCommentClick}
        >
          <MessageSquare className="w-4 h-4" />
          {commentCount} Comments
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PostCard;
