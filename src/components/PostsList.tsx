
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
      <div className="max-w-2xl mx-auto text-center text-muted-foreground">
        Loading posts...
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto text-center text-red-500">
        Error loading posts. Please try again later.
      </div>
    );
  }

  return (
    <section className="max-w-2xl mx-auto">
      {posts?.map((post) => (
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
    </section>
  );
};

export default PostsList;
