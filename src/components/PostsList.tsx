
import PostCard from "./PostCard";
import type { Post } from "@/hooks/usePosts";

interface PostsListProps {
  posts: Post[] | undefined;
  isLoading: boolean;
  error: Error | null;
}

const PostsList = ({ posts, isLoading, error }: PostsListProps) => {
  if (isLoading) {
    return (
      <div className="text-center text-muted-foreground">
        Loading posts...
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6 text-center text-red-500">
        Error loading posts. Please try again later.
      </div>
    );
  }

  if (!posts?.length) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6 text-center text-muted-foreground">
        No posts found. Be the first to share something!
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <PostCard
          key={post.id}
          id={post.id}
          title={post.title}
          content={post.content}
          createdAt={post.created_at}
          commentCount={post.comment_count}
          hashtags={post.hashtags}
          attachments={post.attachment_urls}
          profiles={post.profiles}
          likeCount={post.like_count}
        />
      ))}
    </div>
  );
};

export default PostsList;
