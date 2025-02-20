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
    avatar: '/api/placeholder/64/64',
    role: 'Youth Ministry Leader',
    church: 'Central Adventist Church'
  };

  // Sample posts data
  useEffect(() => {
    // Simulate API fetch
    setTimeout(() => {
      setPosts([
        {
          id: 'post1',
          user: {
            id: 'user2',
            name: 'Pastor David Wilson',
            avatar: '/api/placeholder/64/64',
            role: 'Senior Pastor'
          },
          content: "Join us this Sabbath for our special service focused on mission work! #AdventistMission #Service",
          image: '/api/placeholder/600/400',
          likes: 45,
          comments: 12,
          shares: 8,
          timestamp: '2 hours ago',
          liked: false
        },
        {
          id: 'post2',
          user: {
            id: 'user3',
            name: 'Rachel Lee',
            avatar: '/api/placeholder/64/64',
            role: 'Bible Study Coordinator'
          },
          content: "Our weekly Bible study group will be focusing on the Book of Daniel next month. Everyone is welcome to join us every Wednesday at 7pm. #BibleStudy #BookOfDaniel",
          likes: 32,
          comments: 8,
          shares: 5,
          timestamp: '5 hours ago',
          liked: true
        },
        {
          id: 'post3',
          user: {
            id: 'user4',
            name: 'Health Ministries',
            avatar: '/api/placeholder/64/64',
            role: 'Official Department'
          },
          content: "New plant-based cooking class starting next Sunday! Learn how to prepare nutritious meals that align with our health message. #AdventistHealth #PlantBased #Nutrition",
          image: '/api/placeholder/600/350',
          likes: 67,
          comments: 23,
          shares: 19,
          timestamp: '1 day ago',
          liked: false
        },
      ]);
      setIsLoading(false);
    }, 1000);
  }, []);

  // Handle new post submission
  const handlePostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostContent.trim()) return;
    
    const newPost = {
      id: `post${Date.now()}`,
      user: currentUser,
      content: newPostContent,
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
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          liked: !post.liked,
          likes: post.liked ? post.likes - 1 : post.likes + 1
        };
      }
      return post;
    }));
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Header/Navigation */}
      <header className="bg-indigo-700 text-white fixed w-full z-10 shadow-md">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold">Adventist.com</h1>
            </div>
            
            <div className="hidden md:flex items-center space-x-4">
              <button className="p-2 rounded-full hover:bg-indigo-600 transition-colors">
                <Home className="w-5 h-5" />
              </button>
              <button className="p-2 rounded-full hover:bg-indigo-600 transition-colors">
                <Users className="w-5 h-5" />
              </button>
              <button className="p-2 rounded-full hover:bg-indigo-600 transition-colors">
                <BookOpen className="w-5 h-5" />
              </button>
              <button className="p-2 rounded-full hover:bg-indigo-600 transition-colors">
                <Bell className="w-5 h-5" />
              </button>
              <div className="w-8 h-8 rounded-full overflow-hidden">
                <img src={currentUser.avatar} alt="Profile" className="w-full h-full object-cover" />
              </div>
            </div>
            
            <div className="flex md:hidden">
              <button className="p-2 rounded-full hover:bg-indigo-600 transition-colors">
                <Bell className="w-5 h-5" />
              </button>
              <button className="p-2 rounded-full hover:bg-indigo-600 transition-colors">
                <User className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-20 pb-16">
        <div className="max-w-4xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Left Sidebar - Profile Summary */}
          <aside className="hidden md:block md:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-4 sticky top-20">
              <div className="flex flex-col items-center">
                <div className="w-20 h-20 rounded-full overflow-hidden mb-3">
                  <img src={currentUser.avatar} alt="Profile" className="w-full h-full object-cover" />
                </div>
                <h2 className="font-semibold text-lg">{currentUser.name}</h2>
                <p className="text-sm text-slate-600 mb-1">{currentUser.role}</p>
                <p className="text-xs text-slate-500 mb-4">{currentUser.church}</p>
                
                <div className="w-full border-t border-slate-200 pt-4 mt-2">
                  <div className="flex justify-between text-sm mb-4">
                    <span className="text-slate-600">Connections</span>
                    <span className="font-medium text-indigo-600">247</span>
                  </div>
                  <div className="flex justify-between text-sm mb-4">
                    <span className="text-slate-600">Bible Studies</span>
                    <span className="font-medium text-indigo-600">12</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Prayer Requests</span>
                    <span className="font-medium text-indigo-600">8</span>
                  </div>
                </div>
              </div>
            </div>
          </aside>
          
          {/* Main Feed */}
          <div className="md:col-span-3 space-y-4">
            {/* Create Post */}
            <div className="bg-white rounded-lg shadow-sm p-4">
              <form onSubmit={handlePostSubmit}>
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full overflow-hidden">
                      <img src={currentUser.avatar} alt="Profile" className="w-full h-full object-cover" />
                    </div>
                  </div>
                  <div className="flex-grow">
                    <textarea 
                      className="w-full p-3 rounded-lg border border-slate-200 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="Share something with your community..."
                      rows={3}
                      value={newPostContent}
                      onChange={(e) => setNewPostContent(e.target.value)}
                    />
                    <div className="flex justify-between items-center mt-3">
                      <div className="flex gap-2">
                        <button type="button" className="bg-indigo-50 text-indigo-600 p-2 rounded-full hover:bg-indigo-100 transition-colors">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14" />
                          </svg>
                        </button>
                        <button type="button" className="bg-indigo-50 text-indigo-600 p-2 rounded-full hover:bg-indigo-100 transition-colors">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                        </button>
                        <button type="button" className="bg-indigo-50 text-indigo-600 p-2 rounded-full hover:bg-indigo-100 transition-colors">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </button>
                      </div>
                      <button 
                        type="submit" 
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                        disabled={!newPostContent.trim()}
                      >
                        Post
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
            
            {/* Posts Feed */}
            {isLoading ? (
              <div className="flex justify-center py-12">
                <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
              </div>
            ) : (
              <div className="space-y-4">
                {posts.map(post => (
                  <article key={post.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                    {/* Post Header */}
                    <div className="p-4 flex items-start gap-3">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 rounded-full overflow-hidden">
                          <img src={post.user.avatar} alt={post.user.name} className="w-full h-full object-cover" />
                        </div>
                      </div>
                      <div>
                        <h3 className="font-semibold">{post.user.name}</h3>
                        <p className="text-xs text-slate-500 flex items-center gap-1">
                          <span>{post.user.role}</span>
                          <span>•</span>
                          <span>{post.timestamp}</span>
                        </p>
                      </div>
                    </div>
                    
                    {/* Post Content */}
                    <div className="px-4 pb-3">
                      <p className="whitespace-pre-wrap mb-3">{post.content}</p>
                      {post.image && (
                        <div className="mt-3 -mx-4">
                          <img src={post.image} alt="Post content" className="w-full" />
                        </div>
                      )}
                    </div>
                    
                    {/* Post Stats */}
                    <div className="px-4 py-2 border-t border-slate-100 flex justify-between text-xs text-slate-500">
                      <div>{post.likes} likes</div>
                      <div>{post.comments} comments • {post.shares} shares</div>
                    </div>
                    
                    {/* Post Actions */}
                    <div className="px-4 py-2 border-t border-slate-100 flex justify-between">
                      <button 
                        className={`flex items-center gap-1 px-3 py-1 rounded-md transition-colors ${post.liked ? 'text-indigo-600' : 'text-slate-600 hover:bg-slate-50'}`}
                        onClick={() => toggleLike(post.id)}
                      >
                        <ThumbsUp className="w-5 h-5" />
                        <span>Like</span>
                      </button>
                      <button className="flex items-center gap-1 px-3 py-1 text-slate-600 rounded-md hover:bg-slate-50 transition-colors">
                        <MessageCircle className="w-5 h-5" />
                        <span>Comment</span>
                      </button>
                      <button className="flex items-center gap-1 px-3 py-1 text-slate-600 rounded-md hover:bg-slate-50 transition-colors">
                        <Share2 className="w-5 h-5" />
                        <span>Share</span>
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      
      {/* Mobile Navigation */}
      <nav className="md:hidden fixed bottom-0 w-full bg-white border-t border-slate-200 shadow-lg z-10">
        <div className="flex justify-around items-center h-16">
          <button className="flex flex-col items-center justify-center text-indigo-600">
            <Home className="w-6 h-6" />
            <span className="text-xs mt-1">Home</span>
          </button>
          <button className="flex flex-col items-center justify-center text-slate-600">
            <Search className="w-6 h-6" />
            <span className="text-xs mt-1">Search</span>
          </button>
          <button className="flex flex-col items-center justify-center text-slate-600">
            <Users className="w-6 h-6" />
            <span className="text-xs mt-1">Community</span>
          </button>
          <button className="flex flex-col items-center justify-center text-slate-600">
            <User className="w-6 h-6" />
            <span className="text-xs mt-1">Profile</span>
          </button>
        </div>
      </nav>
    </div>
  );
};

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
