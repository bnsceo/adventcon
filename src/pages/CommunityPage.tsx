import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { Users, UserPlus, Bell, Mail, Heart, MessageSquare, Share2, Bookmark, Search, Home, User, Calendar, Book, Menu, X } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

// Types
interface Profile {
  id: string;
  username: string;
  avatar_url?: string;
  church_role?: string;
  bio?: string;
}

interface Post {
  id: string;
  author_id: string;
  title: string;
  content: string;
  created_at: string;
  likes: number;
  comments: number;
  media_urls?: string[];
  author?: Profile;
  hashtags?: string[];
}

const AdventistFeed: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [newPostContent, setNewPostContent] = useState("");
  const [newPostDialogOpen, setNewPostDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("forYou");
  const { toast } = useToast();

  // Query session
  const { data: session } = useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      return session;
    }
  });

  // Query profile
  const { data: profile } = useQuery<Profile>({
    queryKey: ['profile', session?.user?.id],
    enabled: !!session?.user?.id,
    queryFn: async () => {
      const { data } = await supabase
        .from('profiles')
        .select()
        .eq('id', session!.user.id)
        .single();
      return data as Profile;
    }
  });

  // Query posts
  const { data: posts, isLoading: postsLoading, refetch: refetchPosts } = useQuery<Post[]>({
    queryKey: ['posts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          author:profiles(id, username, avatar_url, church_role)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Post[];
    }
  });

  // Handle post creation
  const handleCreatePost = async () => {
    if (!newPostContent.trim() || !session?.user?.id) return;
    
    try {
      const hashtags = extractHashtags(newPostContent);
      
      const { error } = await supabase
        .from('posts')
        .insert({
          author_id: session.user.id,
          title: newPostContent.substring(0, 50),
          content: newPostContent,
          hashtags,
          likes: 0,
          comments: 0
        });
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Your post has been shared with the community!",
      });
      
      setNewPostContent("");
      setNewPostDialogOpen(false);
      refetchPosts();
    } catch (err) {
      console.error("Error creating post:", err);
      toast({
        title: "Error",
        description: "Failed to create post. Please try again.",
        variant: "destructive",
      });
    }
  };

  const extractHashtags = (content: string) => {
    const hashtagRegex = /#[\w]+/g;
    return content.match(hashtagRegex)?.map(tag => tag.slice(1)) || [];
  };

  // Filter posts based on search and active tab
  const filteredPosts = useMemo(() => {
    if (!posts) return [];
    
    let filtered = posts;
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(post => 
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.author?.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.hashtags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    // Apply tab filter
    if (activeTab === "bible") {
      filtered = filtered.filter(post => 
        post.content.includes("Bible") || 
        post.hashtags?.includes("Bible") ||
        post.hashtags?.includes("Scripture")
      );
    } else if (activeTab === "fellowship") {
      filtered = filtered.filter(post => 
        post.hashtags?.includes("Fellowship") ||
        post.hashtags?.includes("Community")
      );
    }
    
    return filtered;
  }, [posts, searchTerm, activeTab]);

  const trendingTopics = [
    { name: "SabbathBlessing", count: 248 },
    { name: "Prayer", count: 156 },
    { name: "BibleStudy", count: 134 },
    { name: "HealthMessage", count: 97 },
    { name: "MissionField", count: 82 }
  ];

  const upcomingEvents = [
    { name: "Global Prayer Marathon", date: "Jun 15", attendees: 142 },
    { name: "Youth Sabbath Program", date: "Jun 22", attendees: 64 },
    { name: "Health Expo", date: "Jul 1", attendees: 38 },
    { name: "Evangelistic Series", date: "Jul 10", attendees: 27 }
  ];

  return (
    <div className="min-h-screen bg-[#f5f7fa]">
      {/* Top Navigation Bar */}
      <header className="fixed top-0 left-0 right-0 bg-[#1C3F7B] text-white shadow-md z-40">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button 
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <Link to="/" className="flex items-center">
              <span className="font-bold text-xl">Adventist.com</span>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-5">
            <button className="p-2 rounded-full hover:bg-[#2A4E8E] transition">
              <Home size={22} />
            </button>
            <button className="p-2 rounded-full hover:bg-[#2A4E8E] transition">
              <Users size={22} />
            </button>
            <button className="p-2 rounded-full hover:bg-[#2A4E8E] transition">
              <Bell size={22} />
            </button>
            <button className="p-2 rounded-full hover:bg-[#2A4E8E] transition">
              <Mail size={22} />
            </button>
            <div className="h-6 w-px bg-[#4A6B9E]"></div>
            <Link to="/profile">
              <Avatar className="h-9 w-9 border-2 border-white">
                <AvatarImage src={profile?.avatar_url || "/placeholder.svg"} alt={profile?.username || "Profile"} />
                <AvatarFallback className="bg-[#2A4E8E]">
                  {profile?.username?.substring(0, 2) || "U"}
                </AvatarFallback>
              </Avatar>
            </Link>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-30 bg-black bg-opacity-50" onClick={() => setMobileMenuOpen(false)}>
          <div className="bg-white h-full w-64 shadow-xl p-5" onClick={e => e.stopPropagation()}>
            <div className="flex flex-col space-y-6 mt-12">
              {profile && (
                <div className="flex items-center space-x-3 p-3 bg-[#F0F4FA] rounded-lg">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={profile.avatar_url || "/placeholder.svg"} />
                    <AvatarFallback className="bg-[#1C3F7B] text-white">
                      {profile.username?.substring(0, 2) || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{profile.username}</p>
                    <p className="text-sm text-gray-500">{profile.church_role || "Member"}</p>
                  </div>
                </div>
              )}
              
              <div className="space-y-3">
                <Link to="/" className="flex items-center space-x-3 text-[#1C3F7B] font-medium p-2">
                  <Home size={20} />
                  <span>Home</span>
                </Link>
                <Link to="/profile" className="flex items-center space-x-3 text-gray-600 p-2">
                  <User size={20} />
                  <span>Profile</span>
                </Link>
                <Link to="/events" className="flex items-center space-x-3 text-gray-600 p-2">
                  <Calendar size={20} />
                  <span>Events</span>
                </Link>
                <Link to="/bible-study" className="flex items-center space-x-3 text-gray-600 p-2">
                  <Book size={20} />
                  <span>Bible Study</span>
                </Link>
              </div>
              
              <div className="border-t pt-4">
                <h3 className="font-medium text-gray-900 mb-2">Your Groups</h3>
                {['Prayer Warriors', 'Health Ministry', 'Youth Leaders'].map(group => (
                  <Link key={group} to={`/groups/${group.toLowerCase().replace(/\s+/g, '-')}`} className="block py-2 text-gray-600">
                    {group}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4 pt-16 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-4">
          {/* Left Sidebar */}
          <aside className="hidden lg:block lg:col-span-3">
            <div className="sticky top-24 space-y-6">
              {profile && (
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <div className="text-center">
                    <Avatar className="h-20 w-20 mx-auto mb-4 border-4 border-[#E9EFF9]">
                      <AvatarImage src={profile.avatar_url || "/placeholder.svg"} />
                      <AvatarFallback className="bg-[#1C3F7B] text-white text-xl">
                        {profile.username?.substring(0, 2) || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <h2 className="text-lg font-semibold mb-1 text-[#1C3F7B]">{profile.username}</h2>
                    <p className="text-sm text-gray-500 mb-4">{profile.church_role || "Community Member"}</p>
                    <p className="text-sm text-gray-600 mb-4">{profile.bio || "Welcome to Adventist.com!"}</p>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 py-4 border-y border-[#E9EFF9]">
                    <div className="text-center">
                      <div className="text-[#1C3F7B] font-bold">23</div>
                      <div className="text-xs text-gray-500">Posts</div>
                    </div>
                    <div className="text-center">
                      <div className="text-[#1C3F7B] font-bold">142</div>
                      <div className="text-xs text-gray-500">Following</div>
                    </div>
                    <div className="text-center">
                      <div className="text-[#1C3F7B] font-bold">89</div>
                      <div className="text-xs text-gray-500">Followers</div>
                    </div>
                  </div>
                </div>
              )}

              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="font-semibold text-[#1C3F7B] mb-4">Quick Navigation</h3>
                <div className="space-y-3">
                  <Link to="/bible-study" className="flex items-center space-x-3 text-gray-700 hover:text-[#1C3F7B] transition">
                    <div className="w-8 h-8 bg-[#E9EFF9] rounded-full flex items-center justify-center">
                      <Book className="w-4 h-4 text-[#1C3F7B]" />
                    </div>
                    <span>Bible Study</span>
                  </Link>
                  <Link to="/prayer-requests" className="flex items-center space-x-3 text-gray-700 hover:text-[#1C3F7B] transition">
                    <div className="w-8 h-8 bg-[#E9EFF9] rounded-full flex items-center justify-center">
                      <Mail className="w-4 h-4 text-[#1C3F7B]" />
                    </div>
                    <span>Prayer Requests</span>
                  </Link>
                  <Link to="/events" className="flex items-center space-x-3 text-gray-700 hover:text-[#1C3F7B] transition">
                    <div className="w-8 h-8 bg-[#E9EFF9] rounded-full flex items-center justify-center">
                      <Calendar className="w-4 h-4 text-[#1C3F7B]" />
                    </div>
                    <span>Upcoming Events</span>
                  </Link>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-6">
            <div className="space-y-6">
              {/* Search Bar */}
              <div className="bg-white rounded-xl shadow-sm p-4 flex items-center space-x-2">
                <Search className="w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search Adventist.com"
                  className="flex-1 border-none outline-none text-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* Content Tabs */}
              <Tabs defaultValue="forYou" className="w-full" onValueChange={setActiveTab}>
                <TabsList className="bg-white rounded-xl shadow-sm p-1 w-full">
                  <TabsTrigger value="forYou" className="flex-1 data-[state=active]:bg-[#E9EFF9] data-[state=active]:text-[#1C3F7B]">
                    For You
                  </TabsTrigger>
                  <TabsTrigger value="bible" className="flex-1 data-[state=active]:bg-[#E9EFF9] data-[state=active]:text-[#1C3F7B]">
                    Bible
                  </TabsTrigger>
                  <TabsTrigger value="fellowship" className="flex-1 data-[state=active]:bg-[#E9EFF9] data-[state=active]:text-[#1C3F7B]">
                    Fellowship
                  </TabsTrigger>
                </TabsList>
              </Tabs>

              {/* Create Post Card */}
              <div className="bg-white rounded-xl shadow-sm p-4">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={profile?.avatar_url || "/placeholder.svg"} />
                    <AvatarFallback className="bg-[#1C3F7B] text-white">
                      {profile?.username?.substring(0, 2) || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <Dialog open={newPostDialogOpen} onOpenChange={setNewPostDialogOpen}>
                    <DialogTrigger asChild>
                      <button className="flex-1 bg-[#F0F4FA] hover:bg-[#E9EFF9] text-gray-500 text-left px-4 py-2 rounded-full text-sm transition">
                        Share your thoughts with the community...
                      </button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px]">
                      <DialogHeader>
                        <DialogTitle>Create a Post</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 mt-2">
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={profile?.avatar_url || "/placeholder.svg"} />
                            <AvatarFallback className="bg-[#1C3F7B] text-white">
                              {profile?.username?.substring(0, 2) || "U"}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{profile?.username}</p>
                            <p className="text-xs text-gray-500">{profile?.church_role || "Member"}</p>
                          </div>
                        </div>
                        <Textarea
                          placeholder="What's on your mind? Add #hashtags for topics!"
                          className="min-h-[150px]"
                          value={newPostContent}
                          onChange={(e) => setNewPostContent(e.target.value)}
                        />
                        <div className="flex justify-end">
                          <Button 
                            className="bg-[#1C3F7B] hover:bg-[#2A4E8E] text-white"
                            disabled={!newPostContent.trim()}
                            onClick={handleCreatePost}
                          >
                            Share Post
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>

              {/* Posts Feed */}
              <div className="space-y-4">
                {postsLoading ? (
                  <div className="flex justify-center py-10">
                    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#1C3F7B]"></div>
                  </div>
                ) : filteredPosts.length === 0 ? (
                  <div className="bg-white rounded-xl shadow-sm p-8 text-center">
                    <h3 className="text-lg font-medium text-gray-700 mb-2">No posts found</h3>
                    <p className="text-gray-500">
                      {searchTerm 
                        ? "Try different search terms or clear your search"
                        : "Be the first to share something with the community!"}
                    </p>
                  </div>
                ) : (
                  filteredPosts.map((post) => (
                    <div key={post.id} className="bg-white rounded-xl shadow-sm p-4">
                      {/* Post Header */}
                      <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={post.author?.avatar_url || "/placeholder.svg"} />
                            <AvatarFallback className="bg-[#1C3F7B] text-white">
                              {post.author?.username?.substring(0, 2) || "U"}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{post.author?.username}</p>
                            <p className="text-xs text-gray-500">
                              {new Date(post.created_at).toLocaleDateString()} · {post.author?.church_role || "Member"}
                            </p>
                          </div>
                        </div>
                        <button className="text-gray-400 hover:text-gray-600">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                          </svg>
                        </button>
                      </div>
                      
                      {/* Post Content */}
                      <div className="mb-4">
                        <p className="text-gray-800 whitespace-pre-line">{post.content}</p>
                        
                        {/* Hashtags */}
                        {post.hashtags && post.hashtags.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-3">
                            {post.hashtags.map(tag => (
                              <span key={tag} className="text-[#1C3F7B] text-sm font-medium">
                                #{tag}
                              </span>
                            ))}
                          </div>
                        )}
                        
                        {/* Media Images (if any) */}
                        {post.media_urls && post.media_urls.length > 0 && (
                          <div className="mt-3 rounded-lg overflow-hidden">
                            <img
                              src={post.media_urls[0] || "/api/placeholder/600/400"}
                              alt="Post media"
                              className="w-full h-auto object-cover"
                            />
                          </div>
                        )}
                      </div>
                      
                      {/* Post Actions */}
                      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                        <button className="flex items-center space-x-1 text-gray-500 hover:text-[#1C3F7B]">
                          <Heart className="w-5 h-5" />
                          <span>{post.likes || 0}</span>
                        </button>
                        <button className="flex items-center space-x-1 text-gray-500 hover:text-[#1C3F7B]">
                          <MessageSquare className="w-5 h-5" />
                          <span>{post.comments || 0}</span>
                        </button>
                        <button className="flex items-center space-x-1 text-gray-500 hover:text-[#1C3F7B]">
                          <Share2 className="w-5 h-5" />
                        </button>
                        <button className="flex items-center space-x-1 text-gray-500 hover:text-[#1C3F7B]">
                          <Bookmark className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </main>

          {/* Right Sidebar */}
          <aside className="hidden lg:block lg:col-span-3">
            <div className="sticky top-24 space-y-6">
              {/* Trending Topics */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="font-semibold text-[#1C3F7B] mb-4">Trending Topics</h3>
                <div className="space-y-4">
                  {trendingTopics.map((topic) => (
                    <div key={topic.name} className="flex justify-between items-center">
                      <span className="text-[#1C3F7B] font-medium">#{topic.name}</span>
                      <span className="text-xs text-gray-500">{topic.count} posts</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Upcoming Events */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="font-semibold text-[#1C3F7B] mb-4">Upcoming Events</h3>
                <div className="space-y-4">
                  {upcomingEvents.map((event) => (
                    <div key={event.name} className="flex items-center space-x-3">
                      <div className="flex-shrink-0 w-12 h-12 bg-[#E9EFF9] rounded-lg flex flex-col items-center justify-center">
                        <span className="text-xs text-[#1C3F7B] font-medium">{event.date.split(' ')[0]}</span>
                        <span className="text-sm text-[#1C3F7B] font-bold">{event.date.split(' ')[1]}</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">{event.name}</p>
                        <p className="text-xs text-gray-500">{event.attendees} going</p>
                      </div>
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="w-full mt-4 text-[#1C3F7B] border-[#1C3F7B]">
                  View All Events
                </Button>
              </div>

              {/* Suggested Connections */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="font-semibold text-[#1C3F7B] mb-4">People You May Know</h3>
                <div className="space-y-4">
                  {[
                    { name: "Sarah Johnson", role: "Elder", church: "Oakwood SDA" },
                    { name: "Daniel Lee", role: "Youth Leader", church: "Valley View SDA" },
                    { name: "Rebecca Martinez", role: "Music Director", church: "Grace Fellowship" }
                  ].map((person) => (
                    <div key={person.name} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="bg-[#E9EFF9] text-[#1C3F7B]">
                            {person.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-gray-800">{person.name}</p>
                          <p className="text-xs text-gray-500">{person.role} at {person.church}</p>
                        </div>
                      </div>
                      <Button size="sm" className="h-8 bg-[#E9EFF9] hover:bg-[#D9E4F3] text-[#1C3F7B]">
                        <UserPlus className="h-4 w-4 mr-1" />
                        Connect
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default AdventistFeed;
