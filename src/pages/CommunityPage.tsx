import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Users, UserPlus, Bell, Mail, ThumbsUp, MessageSquare, Share2, Bookmark, MoreHorizontal, Image, FileText, Calendar, MapPin } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";

interface Post {
  id: string;
  author: {
    id: string;
    name: string;
    role: string;
    avatar: string;
    church: string;
  };
  content: string;
  timestamp: string;
  likes: number;
  comments: number;
  shares: number;
  images?: string[];
  liked: boolean;
  saved: boolean;
}

interface Profile {
  id: string;
  name: string;
  role: string;
  church: string;
  avatar: string;
  connections: number;
  posts: number;
  churchEvents: number;
}

interface Connection {
  id: string;
  name: string;
  avatar: string;
  role: string;
  mutual: number;
}

interface Event {
  id: string;
  title: string;
  date: string;
  attendees: number;
  location: string;
}

const SocialFeedPage = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("feed");
  const [newPostContent, setNewPostContent] = useState("");
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [suggestedConnections, setSuggestedConnections] = useState<Connection[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);

  useEffect(() => {
    // Simulate data fetching
    setTimeout(() => {
      setProfile({
        id: "1",
        name: "Sarah Johnson",
        role: "Youth Ministry Leader",
        church: "Advent Hope Church",
        avatar: "/api/placeholder/150/150",
        connections: 187,
        posts: 42,
        churchEvents: 12
      });

      setPosts([
        {
          id: "1",
          author: {
            id: "2",
            name: "Pastor David Williams",
            role: "Senior Pastor",
            avatar: "/api/placeholder/150/150",
            church: "First Adventist Church"
          },
          content: "Just finished preparing this week's sermon on faith during difficult times. Looking forward to sharing it with everyone this Sabbath. #FaithJourney #AdventistLife",
          timestamp: "2 hours ago",
          likes: 48,
          comments: 15,
          shares: 7,
          liked: true,
          saved: false
        },
        {
          id: "2",
          author: {
            id: "3",
            name: "Elena Rodriguez",
            role: "Sabbath School Teacher",
            avatar: "/api/placeholder/150/150",
            church: "Maranatha SDA Church"
          },
          content: "Our youth group packed 200 care packages for the homeless outreach program today. So proud of these young people putting their faith into action! #CommunityService #AdventistYouth",
          timestamp: "5 hours ago",
          likes: 124,
          comments: 28,
          shares: 32,
          images: ["/api/placeholder/600/400"],
          liked: false,
          saved: true
        },
        {
          id: "3",
          author: {
            id: "4",
            name: "Michael Chen",
            role: "Health Ministries Director",
            avatar: "/api/placeholder/150/150",
            church: "Living Water SDA"
          },
          content: "Registration is now open for our upcoming plant-based cooking workshop! Learn how to prepare delicious and nutritious meals following the Adventist health message. #PlantBased #AdventistHealth #HealthyLiving",
          timestamp: "Yesterday",
          likes: 87,
          comments: 19,
          shares: 42,
          liked: false,
          saved: false
        }
      ]);

      setSuggestedConnections([
        {
          id: "5",
          name: "Rebecca Thomas",
          avatar: "/api/placeholder/150/150",
          role: "Bible Worker",
          mutual: 12
        },
        {
          id: "6",
          name: "James Wilson",
          avatar: "/api/placeholder/150/150",
          role: "Elder",
          mutual: 8
        },
        {
          id: "7",
          name: "Maria Garcia",
          avatar: "/api/placeholder/150/150",
          role: "Pathfinder Director",
          mutual: 15
        }
      ]);

      setUpcomingEvents([
        {
          id: "e1",
          title: "Prayer & Fasting Sabbath",
          date: "Feb 24",
          attendees: 42,
          location: "Advent Hope Church"
        },
        {
          id: "e2",
          title: "Bible Study Series: Daniel",
          date: "Mar 1",
          attendees: 28,
          location: "Online Event"
        },
        {
          id: "e3",
          title: "Community Service Day",
          date: "Mar 8",
          attendees: 36,
          location: "Downtown Community Center"
        }
      ]);

      setIsLoading(false);
    }, 1000);
  }, []);

  const handlePostSubmit = () => {
    if (!newPostContent.trim()) return;
    
    const newPost: Post = {
      id: `new-${Date.now()}`,
      author: {
        id: profile?.id || "1",
        name: profile?.name || "User",
        role: profile?.role || "Member",
        avatar: profile?.avatar || "/api/placeholder/150/150",
        church: profile?.church || "Adventist Church"
      },
      content: newPostContent,
      timestamp: "Just now",
      likes: 0,
      comments: 0,
      shares: 0,
      liked: false,
      saved: false
    };
    
    setPosts([newPost, ...posts]);
    setNewPostContent("");
    
    toast({
      title: "Post Published",
      description: "Your post has been shared with your connections.",
    });
  };

  const handleLikePost = (postId: string) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          likes: post.liked ? post.likes - 1 : post.likes + 1,
          liked: !post.liked
        };
      }
      return post;
    }));
  };

  const handleSavePost = (postId: string) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return { ...post, saved: !post.saved };
      }
      return post;
    }));
    
    toast({
      title: "Post Saved",
      description: "You can find this post in your saved items.",
    });
  };

  const handleConnect = (connectionId: string) => {
    setSuggestedConnections(
      suggestedConnections.filter(conn => conn.id !== connectionId)
    );
    
    toast({
      title: "Connection Request Sent",
      description: "You'll be notified when they accept.",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600">Loading Adventist.com...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header/Navigation */}
      <header className="sticky top-0 z-10 bg-white border-b shadow-sm">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-10">
              <Link to="/" className="flex items-center">
                <span className="text-primary font-bold text-xl">Adventist.com</span>
              </Link>
              <div className="hidden md:block">
                <Input 
                  className="w-80" 
                  placeholder="Search Adventist.com" 
                  type="search"
                />
              </div>
            </div>
            
            <nav className="flex items-center space-x-1 md:space-x-4">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">3</span>
              </Button>
              <Button variant="ghost" size="icon">
                <Mail className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <Users className="h-5 w-5" />
              </Button>
              <Avatar className="h-8 w-8 cursor-pointer">
                <AvatarImage src={profile?.avatar} alt={profile?.name} />
                <AvatarFallback>{profile?.name.substring(0, 2)}</AvatarFallback>
              </Avatar>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Left Sidebar */}
          <aside className="hidden md:block md:col-span-3">
            <div className="sticky top-24 space-y-6">
              {/* Profile Card */}
              <Card>
                <CardHeader className="text-center pb-4">
                  <div className="mx-auto relative w-24 h-24 mb-2">
                    <Avatar className="w-24 h-24 border-4 border-white shadow">
                      <AvatarImage src={profile?.avatar} alt={profile?.name} />
                      <AvatarFallback>{profile?.name.substring(0, 2)}</AvatarFallback>
                    </Avatar>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{profile?.name}</h3>
                    <p className="text-muted-foreground text-sm">{profile?.role}</p>
                    <p className="text-muted-foreground text-xs">{profile?.church}</p>
                  </div>
                </CardHeader>
                <Separator />
                <CardContent className="pt-4">
                  <div className="grid grid-cols-3 text-center">
                    <div>
                      <p className="font-bold">{profile?.connections}</p>
                      <p className="text-xs text-muted-foreground">Connections</p>
                    </div>
                    <div>
                      <p className="font-bold">{profile?.posts}</p>
                      <p className="text-xs text-muted-foreground">Posts</p>
                    </div>
                    <div>
                      <p className="font-bold">{profile?.churchEvents}</p>
                      <p className="text-xs text-muted-foreground">Events</p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full text-sm">
                    View Profile
                  </Button>
                </CardFooter>
              </Card>

              {/* Quick Links */}
              <Card>
                <CardHeader>
                  <h3 className="text-md font-medium">Community</h3>
                </CardHeader>
                <CardContent className="space-y-3 pt-0">
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-primary" />
                    <span className="text-sm">Prayer Groups</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-primary" />
                    <span className="text-sm">Church Events</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-primary" />
                    <span className="text-sm">Bible Study Resources</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Bookmark className="w-5 h-5 text-primary" />
                    <span className="text-sm">Saved Items</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </aside>

          {/* Main Content */}
          <div className="md:col-span-6">
            <Tabs 
              defaultValue="feed" 
              className="w-full"
              value={activeTab}
              onValueChange={setActiveTab}
            >
              <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger value="feed">Feed</TabsTrigger>
                <TabsTrigger value="trending">Trending</TabsTrigger>
                <TabsTrigger value="bible">Bible Study</TabsTrigger>
              </TabsList>
              
              <TabsContent value="feed" className="mt-0 space-y-6">
                {/* Create Post Card */}
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex gap-4 mb-4">
                      <Avatar>
                        <AvatarImage src={profile?.avatar} alt={profile?.name} />
                        <AvatarFallback>{profile?.name.substring(0, 2)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <Input
                          value={newPostContent}
                          onChange={(e) => setNewPostContent(e.target.value)}
                          className="w-full rounded-full h-12 bg-gray-100 hover:bg-gray-200 transition"
                          placeholder="Share something with the community..."
                        />
                      </div>
                    </div>
                    <div className="flex justify-between items-center pt-2">
                      <div className="flex gap-3">
                        <Button variant="ghost" size="sm" className="text-gray-600">
                          <Image className="w-4 h-4 mr-2" />
                          Photo
                        </Button>
                        <Button variant="ghost" size="sm" className="text-gray-600">
                          <Calendar className="w-4 h-4 mr-2" />
                          Event
                        </Button>
                        <Button variant="ghost" size="sm" className="text-gray-600">
                          <FileText className="w-4 h-4 mr-2" />
                          Article
                        </Button>
                      </div>
                      <Button 
                        size="sm" 
                        onClick={handlePostSubmit}
                        disabled={!newPostContent.trim()}
                      >
                        Post
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Posts Feed */}
                <div className="space-y-6">
                  {posts.map((post) => (
                    <Card key={post.id}>
                      <CardHeader className="pb-3">
                        <div className="flex justify-between">
                          <div className="flex items-start gap-3">
                            <Avatar>
                              <AvatarImage src={post.author.avatar} alt={post.author.name} />
                              <AvatarFallback>{post.author.name.substring(0, 2)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="font-medium">{post.author.name}</h3>
                                {post.author.id === "2" && (
                                  <Badge variant="outline" className="text-xs rounded-full">Pastor</Badge>
                                )}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                <p>{post.author.role} at {post.author.church}</p>
                                <p>{post.timestamp}</p>
                              </div>
                            </div>
                          </div>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="pb-3">
                        <p className="whitespace-pre-line mb-4">{post.content}</p>
                        {post.images && post.images.length > 0 && (
                          <div className="mt-3 rounded-md overflow-hidden">
                            <img
                              src={post.images[0]}
                              alt="Post attachment"
                              className="w-full object-cover"
                            />
                          </div>
                        )}
                      </CardContent>
                      <CardFooter className="flex flex-col">
                        <div className="flex justify-between text-xs text-muted-foreground w-full mb-2">
                          <span>{post.likes} likes</span>
                          <span>{post.comments} comments • {post.shares} shares</span>
                        </div>
                        <Separator className="mb-2" />
                        <div className="flex justify-between w-full">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className={`${post.liked ? 'text-primary' : 'text-gray-600'}`}
                            onClick={() => handleLikePost(post.id)}
                          >
                            <ThumbsUp className="w-4 h-4 mr-2" />
                            Like
                          </Button>
                          <Button variant="ghost" size="sm" className="text-gray-600">
                            <MessageSquare className="w-4 h-4 mr-2" />
                            Comment
                          </Button>
                          <Button variant="ghost" size="sm" className="text-gray-600">
                            <Share2 className="w-4 h-4 mr-2" />
                            Share
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className={`${post.saved ? 'text-primary' : 'text-gray-600'}`}
                            onClick={() => handleSavePost(post.id)}
                          >
                            <Bookmark className="w-4 h-4 mr-2" />
                            Save
                          </Button>
                        </div>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="trending">
                <Card>
                  <CardHeader>
                    <h3 className="text-lg font-medium">Trending in Adventist.com</h3>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-6">Popular discussions and topics in our community</p>
                    <div className="space-y-6">
                      {["HealthMessage", "SabbathReflections", "EndTimeEvents", "AdventistHealth", "YouthMinistry"].map((hashtag, i) => (
                        <div key={hashtag} className="flex gap-4">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                            #{i+1}
                          </div>
                          <div>
                            <h4 className="font-medium">#{hashtag}</h4>
                            <p className="text-sm text-muted-foreground">{245 - (i * 32)} posts • Trending with: 
                              <span className="text-primary"> #{hashtag.toLowerCase()}</span>
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="bible">
                <Card>
                  <CardHeader>
                    <h3 className="text-lg font-medium">Today's Bible Reading</h3>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-primary/5 p-4 rounded-md mb-6">
                      <h4 className="font-semibold mb-2">Psalm 23:1-3</h4>
                      <p className="italic">
                        "The Lord is my shepherd; I shall not want. He makes me lie down in green pastures. 
                        He leads me beside still waters. He restores my soul. He leads me in paths of 
                        righteousness for his name's sake."
                      </p>
                    </div>
                    <h4 className="font-medium mb-3">Join Today's Discussion</h4>
                    <p className="text-sm text-muted-foreground mb-4">
                      How has the Lord been your shepherd through difficult times? Share your testimony with others.
                    </p>
                    <Button>Join Discussion</Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Sidebar */}
          <aside className="hidden md:block md:col-span-3">
            <div className="sticky top-24 space-y-6">
              {/* Connections */}
              <Card>
                <CardHeader>
                  <h3 className="text-md font-medium">People You May Know</h3>
                </CardHeader>
                <CardContent className="space-y-4 pt-0">
                  {suggestedConnections.map(connection => (
                    <div key={connection.id} className="flex items-start gap-3">
                      <Avatar>
                        <AvatarImage src={connection.avatar} alt={connection.name} />
                        <AvatarFallback>{connection.name.substring(0, 2)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm">{connection.name}</h4>
                        <p className="text-xs text-muted-foreground truncate">{connection.role}</p>
                        <p className="text-xs text-muted-foreground">{connection.mutual} mutual connections</p>
                      </div>
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="flex items-center gap-1"
                        onClick={() => handleConnect(connection.id)}
                      >
                        <UserPlus className="h-3 w-3" />
                        <span>Connect</span>
                      </Button>
                    </div>
                  ))}
                </CardContent>
                <CardFooter>
                  <Button variant="ghost" className="w-full text-xs">
                    View More Suggestions
                  </Button>
                </CardFooter>
              </Card>

              {/* Upcoming Events */}
              <Card>
                <CardHeader>
                  <h3 className="text-md font-medium">Upcoming Events</h3>
                </CardHeader>
                <CardContent className="space-y-4 pt-0">
                  {upcomingEvents.map(event => (
                    <div key={event.id} className="flex gap-3">
                      <div className="w-12 h-12 bg-primary/10 rounded flex flex-col items-center justify-center text-primary">
                        <span className="text-xs font-medium">{event.date.split(' ')[0]}</span>
                        <span className="font-bold">{event.date.split(' ')[1]}</span>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{event.title}</h4>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <MapPin className="h-3 w-3" />
                          <span>{event.location}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {event.attendees} people attending
                        </p>
                      </div>
                    </div>
                  ))}
                </CardContent>
                <CardFooter>
                  <Button variant="ghost" className="w-full text-xs">
                    View All Events
                  </Button>
                </CardFooter>
              </Card>

              {/* Trending Topics */}
              <Card>
                <CardHeader>
                  <h3 className="text-md font-medium">Trending Topics</h3>
                </CardHeader>
                <CardContent className="space-y-2 pt-0">
                  {["SabbathSchool", "HealthLiving", "ProphecyStudy", "Prayer", "AdventHope"].map(topic => (
                    <Badge key={topic} variant="secondary" className="mr-2 mb-2 cursor-pointer">
                      #{topic}
                    </Badge>
                  ))}
                </CardContent>
              </Card>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
};

export default SocialFeedPage;
