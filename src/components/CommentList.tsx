
import { useState } from "react";
import { format } from "date-fns";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";
import { Edit2, Trash2, X, Check } from "lucide-react";

interface Comment {
  id: string;
  content: string;
  created_at: string;
  updated_at: string;
  user_id: string;
}

interface CommentListProps {
  postId: string;
}

const CommentList = ({ postId }: CommentListProps) => {
  const [newComment, setNewComment] = useState("");
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: comments, isLoading } = useQuery({
    queryKey: ['comments', postId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('comments')
        .select('*')
        .eq('post_id', postId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data as Comment[];
    },
  });

  const { data: currentUser } = useQuery({
    queryKey: ['currentUser'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      return user;
    },
  });

  const createComment = useMutation({
    mutationFn: async (content: string) => {
      if (!currentUser) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('comments')
        .insert([{ content, post_id: postId, user_id: currentUser.id }]);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', postId] });
      setNewComment("");
      toast({
        title: "Success",
        description: "Your comment has been added.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to add comment. Please try again.",
        variant: "destructive",
      });
    },
  });

  const updateComment = useMutation({
    mutationFn: async ({ id, content }: { id: string; content: string }) => {
      if (!currentUser) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('comments')
        .update({ content })
        .eq('id', id)
        .eq('user_id', currentUser.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', postId] });
      setEditingCommentId(null);
      toast({
        title: "Success",
        description: "Your comment has been updated.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update comment. Please try again.",
        variant: "destructive",
      });
    },
  });

  const deleteComment = useMutation({
    mutationFn: async (id: string) => {
      if (!currentUser) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('comments')
        .delete()
        .eq('id', id)
        .eq('user_id', currentUser.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', postId] });
      toast({
        title: "Success",
        description: "Your comment has been deleted.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete comment. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    await createComment.mutateAsync(newComment);
  };

  const handleEditClick = (comment: Comment) => {
    setEditingCommentId(comment.id);
    setEditContent(comment.content);
  };

  const handleUpdateComment = async () => {
    if (!editingCommentId || !editContent.trim()) return;
    await updateComment.mutateAsync({ id: editingCommentId, content: editContent });
  };

  const handleDeleteComment = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      await deleteComment.mutateAsync(id);
    }
  };

  return (
    <div className="space-y-4">
      <Separator className="my-4" />
      
      <form onSubmit={handleSubmitComment} className="space-y-4">
        <Textarea
          placeholder="Share your thoughts..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="min-h-[80px]"
        />
        <Button 
          type="submit" 
          disabled={!newComment.trim() || createComment.isPending}
        >
          {createComment.isPending ? "Posting..." : "Post Comment"}
        </Button>
      </form>

      <div className="space-y-4 mt-6">
        {isLoading ? (
          <p className="text-center text-muted-foreground">Loading comments...</p>
        ) : comments?.length === 0 ? (
          <p className="text-center text-muted-foreground">No comments yet. Be the first to share your thoughts!</p>
        ) : (
          comments?.map((comment) => (
            <div key={comment.id} className="bg-muted/50 rounded-lg p-4">
              {editingCommentId === comment.id ? (
                <div className="space-y-2">
                  <Textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="min-h-[80px]"
                  />
                  <div className="flex justify-end space-x-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setEditingCommentId(null)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleUpdateComment}
                      disabled={updateComment.isPending}
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <p className="text-sm mb-2">{comment.content}</p>
                  <div className="flex justify-between items-center">
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(comment.created_at), 'MMMM d, yyyy • h:mm a')}
                      {comment.updated_at !== comment.created_at && ' (edited)'}
                    </p>
                    {currentUser?.id === comment.user_id && (
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleEditClick(comment)}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDeleteComment(comment.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CommentList;
