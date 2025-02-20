import React, { useState, useEffect } from 'react';
import { Bell, BookOpen, Home, MessageCircle, Search, Share2, ThumbsUp, User, UserPlus, Users } from 'lucide-react';

const AdventistSocialFeed: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newPostContent, setNewPostContent] = useState('');

  // Sample user data
  const currentUser = {
    id: 'user1',
    name: 'Sarah Johnson',
    avatar: 'https://via.placeholder.com/64',
    role: 'Youth Ministry Leader',
    church: 'Central Adventist Church'
  };

  // Sample posts data
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const samplePosts = [
          {
            id: 'post1',
            user: {
              id: 'user2',
              name: 'Pastor David Wilson',
              avatar: 'https://via.placeholder.com/64',
              role: 'Senior Pastor'
            },
            content: "Join us this Sabbath for our special service focused on mission work! #AdventistMission #Service",
            image: 'https://via.placeholder.com/600x400',
            likes: 45,
            comments: 12,
            shares: 8,
            timestamp: '2 hours ago',
            liked: false
          },
          // ... other sample posts
        ];
        
        setPosts(samplePosts);
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // Handle new post submission
  const handlePostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const content = newPostContent.trim();
    if (!content) return;
    
    const newPost: Post = {
      id: `post${Date.now()}`,
      user: currentUser,
      content,
      likes: 0,
      comments: 0,
      shares: 0,
      timestamp: 'Just now',
      liked: false
    };
    
    setPosts([newPost, ...posts]);
    setNewPostContent('');
  };

  // Toggle like on a post
  const toggleLike = (postId: string) => {
    setPosts(posts.map(post => 
      post.id === postId ? {
        ...post,
        liked: !post.liked,
        likes: post.liked ? post.likes - 1 : post.likes + 1
      } : post
    ));
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Header/Navigation */}
      <header className="bg-indigo-700 text-white fixed w-full z-10 shadow-md">
        <div className="max-w-6xl mx-auto px-4">
          <nav className="flex items-center justify-between h-16">
            <h1 className="text-xl font-bold">Adventist.com</h1>
            
            <div className="hidden md:flex items-center gap-4">
              <button aria-label="Home" className="p-2 rounded-full hover:bg-indigo-600 transition-colors">
                <Home className="w-5 h-5" />
              </button>
              {/* Other desktop navigation buttons */}
              <img 
                src={currentUser.avatar} 
                alt={`${currentUser.name}'s profile`} 
                className="w-8 h-8 rounded-full"
              />
            </div>

            {/* Mobile nav buttons */}
            <div className="flex md:hidden gap-2">
              <button aria-label="Notifications" className="p-2">
                <Bell className="w-5 h-5" />
              </button>
              <button aria-label="Profile" className="p-2">
                <User className="w-5 h-5" />
              </button>
            </div>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-20 pb-16">
        <div className="max-w-4xl mx-auto px-4 grid md:grid-cols-4 gap-6">
          {/* Profile Sidebar */}
          <aside className="hidden md:block sticky top-20 h-fit">
            <div className="bg-white rounded-lg shadow-sm p-4">
              <div className="flex flex-col items-center">
                <img
                  src={currentUser.avatar}
                  alt={`${currentUser.name}'s profile`}
                  className="w-20 h-20 rounded-full mb-3"
                />
                <h2 className="font-semibold text-lg">{currentUser.name}</h2>
                <p className="text-sm text-slate-600">{currentUser.role}</p>
                <p className="text-xs text-slate-500 mb-4">{currentUser.church}</p>
                
                <div className="w-full space-y-4 border-t border-slate-200 pt-4">
                  <StatItem label="Connections" value="247" />
                  <StatItem label="Bible Studies" value="12" />
                  <StatItem label="Prayer Requests" value="8" />
                </div>
              </div>
            </div>
          </aside>

          {/* Main Feed */}
          <div className="md:col-span-3 space-y-4">
            {/* Create Post */}
            <PostForm
              onSubmit={handlePostSubmit}
              content={newPostContent}
              onContentChange={setNewPostContent}
              userAvatar={currentUser.avatar}
            />
            
            {/* Posts Feed */}
            {isLoading ? (
              <LoadingSpinner />
            ) : (
              <div className="space-y-4">
                {posts.map(post => (
                  <PostItem
                    key={post.id}
                    post={post}
                    onLike={toggleLike}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Mobile Navigation */}
      <MobileNav />
    </div>
  );
};

// Helper Components
const StatItem: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="flex justify-between text-sm">
    <span className="text-slate-600">{label}</span>
    <span className="font-medium text-indigo-600">{value}</span>
  </div>
);

const PostForm: React.FC<{
  onSubmit: (e: React.FormEvent) => void;
  content: string;
  onContentChange: (value: string) => void;
  userAvatar: string;
}> = ({ onSubmit, content, onContentChange, userAvatar }) => (
  <form onSubmit={onSubmit} className="bg-white rounded-lg shadow-sm p-4">
    <div className="flex gap-3">
      <img
        src={userAvatar}
        alt="Your profile"
        className="w-10 h-10 rounded-full flex-shrink-0"
      />
      <div className="flex-grow">
        <textarea
          className="w-full p-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500"
          placeholder="Share something with your community..."
          rows={3}
          value={content}
          onChange={(e) => onContentChange(e.target.value)}
        />
        <div className="flex justify-between items-center mt-3">
          <div className="flex gap-2">
            <MediaButton icon="image" />
            <MediaButton icon="video" />
            <MediaButton icon="event" />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
            disabled={!content.trim()}
          >
            Post
          </button>
        </div>
      </div>
    </div>
  </form>
);

const MediaButton: React.FC<{ icon: 'image' | 'video' | 'event' }> = ({ icon }) => {
  const icons = {
    image: <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14" />,
    video: <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />,
    event: <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  };

  return (
    <button
      type="button"
      className="bg-indigo-50 text-indigo-600 p-2 rounded-full hover:bg-indigo-100"
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        {icons[icon]}
      </svg>
    </button>
  );
};

const PostItem: React.FC<{ post: Post; onLike: (id: string) => void }> = ({ post, onLike }) => (
  <article className="bg-white rounded-lg shadow-sm">
    <div className="p-4 flex gap-3">
      <img
        src={post.user.avatar}
        alt={post.user.name}
        className="w-10 h-10 rounded-full"
      />
      <div>
        <h3 className="font-semibold">{post.user.name}</h3>
        <div className="text-xs text-slate-500">
          {post.user.role && <>{post.user.role} • </>}{post.timestamp}
        </div>
      </div>
    </div>

    <div className="px-4 pb-3">
      <p className="whitespace-pre-wrap mb-3">{post.content}</p>
      {post.image && (
        <img
          src={post.image}
          alt="Post content"
          className="w-full rounded-lg"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = 'none';
          }}
        />
      )}
    </div>

    <div className="px-4 py-2 border-t border-slate-100 flex justify-between text-xs text-slate-500">
      <div>{post.likes} likes</div>
      <div>{post.comments} comments • {post.shares} shares</div>
    </div>

    <div className="px-4 py-2 border-t border-slate-100 flex justify-between">
      <PostAction
        icon={<ThumbsUp className="w-5 h-5" />}
        label="Like"
        active={post.liked}
        onClick={() => onLike(post.id)}
      />
      <PostAction icon={<MessageCircle className="w-5 h-5" />} label="Comment" />
      <PostAction icon={<Share2 className="w-5 h-5" />} label="Share" />
    </div>
  </article>
);

const PostAction: React.FC<{
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
}> = ({ icon, label, active = false, onClick }) => (
  <button
    className={`flex items-center gap-1 px-3 py-1 rounded-md transition-colors ${
      active ? 'text-indigo-600' : 'text-slate-600 hover:bg-slate-50'
    }`}
    onClick={onClick}
  >
    {icon}
    <span>{label}</span>
  </button>
);

const LoadingSpinner: React.FC = () => (
  <div className="flex justify-center py-12">
    <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
  </div>
);

const MobileNav: React.FC = () => (
  <nav className="md:hidden fixed bottom-0 w-full bg-white border-t border-slate-200 shadow-lg">
    <div className="flex justify-around h-16 items-center">
      {[
        { icon: <Home className="w-6 h-6" />, label: 'Home' },
        { icon: <Search className="w-6 h-6" />, label: 'Search' },
        { icon: <Users className="w-6 h-6" />, label: 'Community' },
        { icon: <User className="w-6 h-6" />, label: 'Profile' },
      ].map((item) => (
        <button
          key={item.label}
          className="flex flex-col items-center text-slate-600"
          aria-label={item.label}
        >
          {item.icon}
          <span className="text-xs mt-1">{item.label}</span>
        </button>
      ))}
    </div>
  </nav>
);

// Type definitions
interface User {
  id: string;
  name: string;
  avatar: string;
  role?: string;
  church?: string;
}

interface Post {
  id: string;
  user: User;
  content: string;
  image?: string;
  likes: number;
  comments: number;
  shares: number;
  timestamp: string;
  liked: boolean;
}

export default AdventistSocialFeed;
