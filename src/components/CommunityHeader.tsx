
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";
import CreatePostDialog from "./CreatePostDialog";

interface CommunityHeaderProps {
  onCreatePost: (title: string, content: string, files: File[]) => Promise<void>;
}

const CommunityHeader = ({ onCreatePost }: CommunityHeaderProps) => {
  return (
    <section className="max-w-4xl mx-auto text-center mb-12 animate-fade-in">
      <div className="inline-block p-2 bg-primary/10 rounded-full mb-4">
        <Users className="w-6 h-6 text-primary" />
      </div>
      <h1 className="text-4xl font-bold mb-4">
        Community
      </h1>
      <p className="text-lg text-muted-foreground mb-8">
        Share your faith journey and connect with fellow believers
      </p>
      <CreatePostDialog onCreatePost={onCreatePost} />
    </section>
  );
};

export default CommunityHeader;
