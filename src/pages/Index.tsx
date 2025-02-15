
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import DevotionalCard from "@/components/DevotionalCard";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const navigate = useNavigate();
  const { data: session } = useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      return session;
    },
  });

  const handleJoinCommunity = () => {
    if (session) {
      navigate('/community');
    } else {
      navigate('/auth');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 pt-24 pb-12">
        <section className="max-w-4xl mx-auto text-center mb-16 animate-fade-in">
          <div className="inline-block p-2 bg-primary/10 rounded-full mb-4">
            <Heart className="w-6 h-6 text-primary" />
          </div>
          <h1 className="text-4xl font-bold mb-4">
            Where Faith and Community Thrive
          </h1>
          <p className="text-lg text-muted-foreground mb-8">
            Connect with fellow believers, share your faith journey, and grow together in Christ.
          </p>
          <Button onClick={handleJoinCommunity}>
            {session ? "Go to Community" : "Join Our Community"}
          </Button>
        </section>

        <section className="max-w-2xl mx-auto mb-16">
          <DevotionalCard
            verse="For where two or three gather in my name, there am I with them."
            reference="Matthew 18:20"
            reflection="In our digital age, gathering in His name takes on new meaning. Through technology, we can create sacred spaces for fellowship and worship that transcend physical boundaries."
            date="Today"
          />
        </section>

        <section className="max-w-4xl mx-auto grid md:grid-cols-3 gap-6">
          <div className="faith-card">
            <h3 className="text-lg font-semibold mb-2">Connect</h3>
            <p className="text-sm text-muted-foreground">
              Find and connect with fellow believers from your local church and around the world.
            </p>
          </div>
          <div className="faith-card">
            <h3 className="text-lg font-semibold mb-2">Share</h3>
            <p className="text-sm text-muted-foreground">
              Share your faith journey, testimonies, and prayer requests with the community.
            </p>
          </div>
          <div className="faith-card">
            <h3 className="text-lg font-semibold mb-2">Grow</h3>
            <p className="text-sm text-muted-foreground">
              Access daily devotionals, Bible studies, and spiritual resources for growth.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Index;
